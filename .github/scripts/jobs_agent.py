#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
💼 Job Agent — وكيل الشواغر الوظيفية (بدون اشتراط اللغة الهولندية)
===================================================================
يعمل كل ساعة عبر GitHub Actions:
1. يجلب الوظائف من واجهات API عامة ومجانية (Themuse + Remotive — بدون مفاتيح).
2. يستبعد الوظائف التي تشترط اللغة الهولندية صراحةً (فحص نصي ذكي).
3. يمنع التكرار نهائياً عبر بصمة فريدة (hash) لكل وظيفة محفوظة في jobs/seen.json.
4. يحدّث jobs/jobs.json الذي تعرضه صفحة jobs.html مباشرة.

المصادر:
  - Themuse API : https://www.themuse.com/api/public/jobs?location=Netherlands
  - Remotive API: https://remotive.com/api/remote-jobs (وظائف عن بعد صالحة من هولندا)

يعود دائماً بحالة نجاح (exit 0) ولا يكتب الملفات إلا عند وجود تحديث فعلي.
"""

import os
import re
import sys
import json
import hashlib
import datetime

import requests

# ضمان عمل الطباعة (إيموجي/عربية) على أي نظام تشغيل
for _stream in (sys.stdout, sys.stderr):
    if hasattr(_stream, "reconfigure"):
        _stream.reconfigure(encoding="utf-8", errors="replace")

JOBS_DIR = "jobs"
JOBS_FILE = os.path.join(JOBS_DIR, "jobs.json")
SEEN_FILE = os.path.join(JOBS_DIR, "seen.json")
MAX_ACTIVE = 100          # 🎯 القائمة تعرض أحدث 100 وظيفة (تتجدد يومياً)
MAX_SEEN = 5000           # ذاكرة منع التكرار
EXPIRY_DAYS = int(os.environ.get("JOB_EXPIRY_DAYS", "14"))  # حذف الوظائف الأقدم من كذا يوم (عدّل من إعدادات الـ Workflow)
TIMEOUT = 30
UA = {"User-Agent": "MBO-JobAgent/1.0 (github.com/a-alzoubi-07-11)"}

# أنماط تشير صراحةً إلى اشتراط الهولندية → استبعاد
DUTCH_REQUIRED_RE = re.compile(
    r"(fluent|native|near-native|advanced|proficient|excellent|good|strong|basic)\s+(level\s+of\s+)?(spoken|written)?\s*Dutch"
    r"|(native|fluent|near-native)\s+Nederlands"
    r"|Dutch\s+(language\s+)?(is|is a|is an)\s+(a\s+)?(must|requirement|prerequisite)"
    r"|(kennis|beheersing)\s+van\s+het\s+Nederlands"
    r"|Nederlands\s+(op|als\s+moedertaal)",
    re.I,
)

# أشتراطات لغات أخرى (غير الإنجليزية/العربية) → استبعاد
OTHER_LANG_RE = re.compile(
    r"(fluent|native|near-native|moedertaal|muttersprachler|vergader|bilingual)\s+(in\s+)?"
    r"(german|french|spanish|italian|polish|dutch|nederlands|deutsch|francais)"
    r"|(german|french|dutch|nederlands)\s+(speaker|language\s+skills)\s+(required|is\s+a\s+must)",
    re.I,
)

# 🤝 وظائف مخصصة للمهاجرين واللاجئين والمبتدئين (أولوية في التصنيف)
MIGRANT_RE = re.compile(
    r"(vluchteling|statushouder|nieuwkomer|gevlucht|inburgering|migrant|refugee|newcomer"
    r"|geen\s+nederlands\s+vereist|no\s+dutch\s+(required|needed)"
    r"|taal\s+niet\s+nodig|werken\s+zonder\s+nederlands"
    r"|uaf\.nl|stichting\s+uaf)",
    re.I,
)

CATEGORIES = {
    "logistics": ["warehouse", "order picker", "logistic", "driver", "chauffeur", "forklift", "picker", "packer"],
    "hospitality": ["waiter", "chef", "cook", "kitchen", "barista", "housekeeping", "horeca", "hotel"],
    "customer_service": ["customer service", "support agent", "call center", "multilingual"],
    "it": ["developer", "software", "engineer", "data", "devops", "frontend", "backend", "qa", "it "],
    "healthcare": ["nurse", "caregiver", "healthcare", "zorg", "verzorgende"],
    "technical": ["mechanic", "electrician", "technician", "monteur", "welder", "installatie"],
    "other": [],
}


def now_iso():
    return datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d %H:%M UTC")


def clean_text(html_text, limit=600):
    text = re.sub(r"<[^>]+>", " ", html_text or "")
    text = re.sub(r"\s+", " ", text).strip()
    return text[:limit]


def classify(title, snippet):
    text = f"{title} {snippet}".lower()
    # 🤝 الأولوية لوظائف المهاجرين واللاجئين
    if MIGRANT_RE.search(text):
        return "migrant"
    # "it" بكلمة كاملة فقط (وإلا التقطت داخل كلمات أخرى مثل edit/unit)
    if re.search(r"\b(it|ict)\b", text):
        return "it"
    for cat, keys in CATEGORIES.items():
        if cat in ("other", "it"):
            continue
        if any(k in text for k in keys):
            return cat
    return "other"


def job_id(url):
    """بصمة فريدة ثابتة — أساس منع التكرار."""
    normalized = (url or "").split("?")[0].strip().lower().rstrip("/")
    return hashlib.sha1(normalized.encode()).hexdigest()[:16]


GERMAN_WORDS_RE = re.compile(
    r"\b(und|oder|für|mit|der|die|das|wir|sie|innerhalb|sowie|als)\b", re.I
)


def excluded_by_language(title, snippet):
    text = f"{title}. {snippet}"
    if DUTCH_REQUIRED_RE.search(text):
        return True
    if OTHER_LANG_RE.search(text):
        return True
    # إشارات دالة على أن الإعلان مكتوب بالألمانية
    if "🇩🇪" in title or "m/w/d" in title.lower() or "m/w/d" in snippet.lower():
        return True
    if len(GERMAN_WORDS_RE.findall(text)) >= 4:
        return True
    # نسخة وظيفة مخصصة للناطقين بالهولندية صراحةً مثل "... (Nederlands)"
    if re.search(r"[(]\s*(nederlands|dutch|nl[- ]?talig)\s*[)]", title, re.I):
        return True
    return False


def fetch_adzuna():
    """وظائف محلية في هولندا بدون لغة (مستودعات، تنظيف، مطاعم...) —
    تُتفعل تلقائياً عند إضافة ADZUNA_APP_ID و ADZUNA_API_KEY في Secrets
    (مفتاح مجاني من: developer.adzuna.com)."""
    app_id = os.environ.get("ADZUNA_APP_ID", "").strip()
    app_key = os.environ.get("ADZUNA_API_KEY", "").strip()
    if not (app_id and app_key):
        print("[Job Agent] adzuna: skipped (no keys in Secrets)")
        return []
    out = []
    queries = ["warehouse", "order picker", "cleaner", "kitchen", "driver", "packer",
               "statushouder", "vluchteling", "refugee newcomer"]
    for q in queries:
        try:
            r = requests.get(
                "https://api.adzuna.com/v1/api/jobs/nl/search/1",
                params={"app_id": app_id, "app_key": app_key, "results_count": 20,
                        "what": q, "max_days_old": 14, "content_type": "text/html"},
                timeout=TIMEOUT, headers=UA,
            )
            r.raise_for_status()
            for j in r.json().get("results", []):
                snippet = clean_text(j.get("description", ""))
                title = (j.get("title") or "").strip()
                out.append({
                    "title": title,
                    "company": (j.get("company") or {}).get("display_name", "").strip(),
                    "location": j.get("location", {}).get("display_name", "Netherlands"),
                    "url": (j.get("redirect_url") or "").strip(),
                    "source": "adzuna",
                    "published": (j.get("created") or "")[:10],
                    "category": classify(title, snippet),
                    "snippet": snippet[:220],
                })
        except Exception as exc:  # noqa: BLE001
            print(f"[Job Agent] adzuna '{q}' failed: {type(exc).__name__}")
    print(f"[Job Agent] adzuna: {len(out)} jobs fetched")
    return out


# ────────────────────────── المصادر ──────────────────────────

def fetch_themuse():
    """وظائف في هولندا من Themuse (بدون مفتاح API)."""
    out, page = [], 1
    while page <= 3:
        try:
            r = requests.get(
                "https://www.themuse.com/api/public/jobs",
                params={"page": page, "location": "Netherlands"},
                timeout=TIMEOUT, headers=UA,
            )
            r.raise_for_status()
            data = r.json()
        except Exception as exc:  # noqa: BLE001
            print(f"[Job Agent] themuse p{page} failed: {type(exc).__name__}")
            break
        jobs = data.get("results", [])
        if not jobs:
            break
        for j in jobs:
            locations_list = [loc.get("name", "") for loc in (j.get("locations") or [])]
            # فلترة صارمة: هولندا فقط (واجهة الـ API تتجاهل أحياناً باراميتر الموقع)
            if not any("netherlands" in loc.lower() for loc in locations_list):
                continue
            snippet = clean_text(j.get("contents", ""))
            title = (j.get("name") or "").strip()
            company = ((j.get("company") or {}).get("name") or "").strip()
            locations = ", ".join(locations_list)
            url = f"https://www.themuse.com/jobs/{j.get('id', '')}"
            out.append({
                "title": title, "company": company, "location": locations or "Netherlands",
                "url": url, "source": "themuse", "published": (j.get("publication_date") or "")[:10],
                "category": classify(title, snippet), "snippet": snippet[:220],
            })
        page += 1
    print(f"[Job Agent] themuse: {len(out)} jobs fetched")
    return out


def fetch_remotive():
    """وظائف عن بعد في هولندا حصراً (بدون مفتاح API)."""
    out = []
    try:
        r = requests.get(
            "https://remotive.com/api/remote-jobs",
            params={"limit": 80},
            timeout=TIMEOUT, headers=UA,
        )
        r.raise_for_status()
        for j in r.json().get("jobs", []):
            loc = (j.get("candidate_required_location") or "").strip()
            # 🇳🇱 السوق الهولندي فقط — لا worldwide ولا Europe
            if "netherlands" not in loc.lower():
                continue
            snippet = clean_text(j.get("description", ""))
            title = (j.get("title") or "").strip()
            out.append({
                "title": title,
                "company": (j.get("company_name") or "").strip(),
                "location": loc or "Remote (Worldwide)",
                "url": (j.get("url") or "").strip(),
                "source": "remotive",
                "published": (j.get("publication_date") or "")[:10],
                "category": classify(title, snippet),
                "snippet": snippet[:220],
            })
    except Exception as exc:  # noqa: BLE001
        print(f"[Job Agent] remotive failed: {type(exc).__name__}")
    print(f"[Job Agent] remotive: {len(out)} jobs fetched")
    return out


# ────────────────────────── الحفظ ومنع التكرار ──────────────────────────

# شركات هولندية توظف عبر SmartRecruiters (توسيع القائمة سهل — أضف المعرف هنا)
SR_COMPANIES = ["Coolblue", "KPN", "Picnic", "Uber"]


def fetch_smartrecruiters():
    """وظائف حقيقية من مواقع التوظيف الرسمية لشركات هولندية (بدون مفتاح API).
    المنصة: SmartRecruiters — بيانات مهيكلة: المدينة، التاريخ، الشركة، رابط التقديم."""
    out = []
    for comp in SR_COMPANIES:
        try:
            r = requests.get(
                f"https://api.smartrecruiters.com/v1/companies/{comp}/postings",
                params={"limit": 100},
                timeout=TIMEOUT, headers=UA,
            )
            r.raise_for_status()
            for j in r.json().get("content", []):
                loc = j.get("location") or {}
                if (loc.get("country") or "").lower() != "nl":
                    continue  # 🇳🇱 السوق الهولندي فقط
                title = (j.get("name") or "").strip()
                industry = ((j.get("industry") or {}).get("label") or "").strip()
                dept = ((j.get("department") or {}).get("label") or "").strip()
                snippet = clean_text(f"{industry} {dept}")
                out.append({
                    "title": title,
                    "company": ((j.get("company") or {}).get("name") or comp).strip(),
                    "location": f"{loc.get('city') or 'Netherlands'}, Netherlands",
                    "url": f"https://jobs.smartrecruiters.com/{comp}/{j.get('id', '')}",
                    "source": "smartrecruiters",
                    "published": (j.get("releasedDate") or "")[:10],
                    "category": classify(title, snippet),
                    "snippet": snippet[:220],
                })
        except Exception as exc:  # noqa: BLE001
            print(f"[Job Agent] smartrecruiters '{comp}' failed: {type(exc).__name__}")
    print(f"[Job Agent] smartrecruiters: {len(out)} jobs fetched")
    return out


LI_KEYWORDS = [
    "warehouse", "order picker", "cleaner", "kitchen", "driver", "logistics", "packer", "store employee",
    # 🤝 مخصصة للمهاجرين واللاجئين
    "statushouder", "vluchteling", "refugee", "nieuwkomer", "migrant friendly", "no dutch required",
]


def fetch_linkedin():
    """LinkedIn Jobs (واجهة الضيوف العامة) — هولندا فقط.
    يُجرب 3 كلمات بحث تتبدل كل ساعة (حماية من تحديد المعدل)."""
    out = []
    hour = datetime.datetime.now(datetime.timezone.utc).hour
    general = LI_KEYWORDS[:8]
    migrant = LI_KEYWORDS[8:]
    # استعلامان عامان + استعلام مخصص دائم للمهاجرين واللاجئين كل ساعة 🤝
    kws = [general[(hour * 2 + i) % len(general)] for i in range(2)]
    kws.append(migrant[hour % len(migrant)])
    for kw in kws:
        try:
            r = requests.get(
                "https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search",
                params={"keywords": kw, "location": "Netherlands", "start": 0},
                timeout=TIMEOUT,
                headers={**UA, "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
                         "Accept-Language": "en-US,en;q=0.9"},
            )
            if r.status_code != 200:
                print(f"[Job Agent] linkedin '{kw}': HTTP {r.status_code} (rate-limited? skipping)")
                continue
            html = r.text
            # التقسيم على معرف الوظيفة الفريد (وليس أسماء الكلاسات — بعضها يحتوي الكلمة نفسها!)
            for chunk in html.split('data-entity-urn="urn:li:jobPosting:')[1:]:
                mu = re.search(r'href="(https://[^"]*linkedin\.com/jobs/view/[^"]+)"', chunk)
                mt = re.search(r"base-search-card__title[^>]*>([\s\S]*?)</h3>", chunk)
                mc = re.search(r"base-search-card__subtitle[^>]*>([\s\S]*?)</h4>", chunk)
                ml = re.search(r"job-search-card__location[^>]*>([\s\S]*?)</span>", chunk)
                md = re.search(r'datetime="([0-9-]{10})', chunk)
                if not (mu and mt):
                    continue
                title = clean_text(mt.group(1), 200)
                company = clean_text(mc.group(1) if mc else "", 100)
                location = clean_text(ml.group(1) if ml else "Netherlands", 100)
                if not location or "netherlands" not in location.lower():
                    location = location or "Netherlands"  # 🇳🇱 السوق الهولندي فقط
                snippet = clean_text(chunk, 220)
                # استعلامات المهاجرين: نقبل فقط الوظائف المخصصة لهم فعلاً (ضد النتائج الضبابية)
                if kw in LI_KEYWORDS[8:] and classify(title, snippet) != "migrant":
                    continue
                out.append({
                    "title": title,
                    "company": company,
                    "location": location,
                    "url": mu.group(1).split("?")[0],
                    "source": "linkedin",
                    "published": md.group(1) if md else "",
                    "category": classify(title, snippet),
                    "snippet": snippet[:220],
                })
        except Exception as exc:  # noqa: BLE001
            print(f"[Job Agent] linkedin '{kw}' failed: {type(exc).__name__}")
    print(f"[Job Agent] linkedin: {len(out)} jobs fetched")
    return out


OFFICIAL_SITES = [
    "werk.nl", "randstad.nl", "tempo-team.nl", "adecco.nl",
    "youngcapital.nl", "indeed.com", "jobbird.com", "uwv.nl",
]


def fetch_google_cse():
    """بحث غوغل موجّه نحو المواقع الرسمية للتوظيف في هولندا.
    يُتفعل عند إضافة GOOGLE_API_KEY و GOOGLE_CSE_ID في Secrets
    (مجاني: 100 استعلام يومياً — Programmable Search JSON API)."""
    key = os.environ.get("GOOGLE_API_KEY", "").strip()
    cse = os.environ.get("GOOGLE_CSE_ID", "").strip()
    if not (key and cse):
        print("[Job Agent] google: skipped (no keys in Secrets)")
        return []
    out = []
    # 4 استعلامات لكل تشغيل (96/يوم — ضمن الحصة المجانية 100)
    keywords = ["warehouse", "order picker", "cleaner", "kitchen", "driver", "productiemedewerker",
                "statushouder vacature", "vluchteling werk", "vacature nieuwkomer"]
    hour = datetime.datetime.now(datetime.timezone.utc).hour
    # أول استعلام دائماً مخصص للمهاجرين واللاجئين 🤝 + 3 عامة تتبدل
    picked = [keywords[6 + (hour % 3)]] + [keywords[i % 6] for i in range(hour, hour + 3)]
    for i, q in enumerate(picked):
        site = OFFICIAL_SITES[(hour + i) % len(OFFICIAL_SITES)]
        try:
            r = requests.get(
                "https://www.googleapis.com/customsearch/v1",
                params={"key": key, "cx": cse, "q": q, "num": 10,
                        "siteSearch": site, "siteSearchFilter": "i",
                        "cr": "countryNL"},
                timeout=TIMEOUT, headers=UA,
            )
            r.raise_for_status()
            for item in r.json().get("items", []):
                link = (item.get("link") or "").strip()
                title = re.sub(r"[-|–]" + re.escape(site) + r"$", "", item.get("title", "")).strip()
                snippet = clean_text(item.get("snippet", ""))
                out.append({
                    "title": title,
                    "company": "",
                    "location": "Netherlands",
                    "url": link,
                    "source": "google",
                    "published": "",
                    "category": classify(title, snippet),
                    "snippet": snippet[:220],
                })
        except Exception as exc:  # noqa: BLE001
            print(f"[Job Agent] google '{q}' failed: {type(exc).__name__}")
    print(f"[Job Agent] google: {len(out)} jobs fetched")
    return out


def load_json(path, default):
    if os.path.exists(path):
        try:
            with open(path, encoding="utf-8") as f:
                return json.load(f)
        except Exception:  # noqa: BLE001
            pass
    return default


def save_json(path, data):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    tmp = path + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
    os.replace(tmp, path)


def main():
    today = datetime.date.today().isoformat()
    existing = load_json(JOBS_FILE, {"updated_at": "", "count": 0, "jobs": []})
    seen = load_json(SEEN_FILE, {})

    current_by_id = {j["id"]: j for j in existing.get("jobs", [])}
    fetched = (fetch_smartrecruiters() + fetch_linkedin() + fetch_themuse()
               + fetch_remotive() + fetch_adzuna() + fetch_google_cse())

    new_count = 0
    for j in fetched:
        if not j["url"] or not j["title"]:
            continue
        jid = job_id(j["url"])
        j["id"] = jid
        # استبعاد ما يشترط الهولندية أو أي لغة أخرى صراحةً
        if excluded_by_language(j["title"], j.get("snippet", "")):
            continue
        if jid in seen:
            # موجود سابقاً → لا نكرره، فقط نحتفظ به في القائمة إن كان نشطاً
            if jid in current_by_id:
                current_by_id[jid]["seen_today"] = today  # علامة أنه ما زال متاحاً
            continue
        seen[jid] = today
        j["added"] = today
        current_by_id[jid] = j
        new_count += 1

    # 🧹 تنظيف الوظائف القديمة بالتاريخ (أقدم من EXPIRY_DAYS أيام → تُحذف)
    cutoff = (datetime.date.today() - datetime.timedelta(days=EXPIRY_DAYS)).isoformat()
    def effective_date(j):
        return (j.get("published") or j.get("added") or "")[:10]
    expired = [j for j in current_by_id.values() if effective_date(j) and effective_date(j) < cutoff]
    for j in expired:
        current_by_id.pop(j["id"], None)
    if expired:
        print(f"[Job Agent] 🧹 expired & removed: {len(expired)} jobs older than {EXPIRY_DAYS} days")

    # ترتيب: الأحدث أولاً، ثم قص القائمة لأحدث 100 وظيفة
    jobs = sorted(current_by_id.values(), key=lambda x: (effective_date(x), x.get("added", "")), reverse=True)
    jobs = jobs[:MAX_ACTIVE]

    # تقليم ذاكرة منع التكرار إذا كبرت جداً (الأقدم يُحذف)
    if len(seen) > MAX_SEEN:
        seen = dict(sorted(seen.items(), key=lambda kv: kv[1], reverse=True)[:MAX_SEEN])

    payload = {"updated_at": now_iso(), "count": len(jobs), "new_today": new_count, "jobs": jobs}

    changed = new_count > 0 or payload["updated_at"] != existing.get("updated_at")
    if changed:
        save_json(JOBS_FILE, payload)
        save_json(SEEN_FILE, seen)
        print(f"[Job Agent] ✅ saved: {len(jobs)} active jobs ({new_count} new)")
    else:
        print("[Job Agent] no changes — files untouched")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as exc:  # noqa: BLE001
        print(f"[Job Agent] ❌ unexpected failure: {exc}")
        sys.exit(0)
