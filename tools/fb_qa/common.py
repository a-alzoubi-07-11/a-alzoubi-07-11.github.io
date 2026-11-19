"""Shared paths, config, database and text helpers for the Facebook-groups Q&A tool.

Everything here stays on the owner's computer: the SQLite database, screenshots,
the Facebook login profile and the drafts are all git-ignored (see .gitignore).
"""
from __future__ import annotations

import datetime as dt
import hashlib
import json
import re
import sqlite3
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
SITE_ROOT = HERE.parents[1]          # repo root: tools/fb_qa -> tools -> root
DATA = HERE / "data"
SHOTS = DATA / "screenshots"
DRAFTS = HERE / "drafts"
OUT = HERE / "out"
PROFILE = HERE / "fb_profile"
DB_PATH = DATA / "fb_groups.db"

DEFAULTS = {
    "groups": [],
    "max_posts_per_day": 15,              # hard cap: new posts per day, all groups together
    "sessions_per_day": [3, 5],           # the 15 are split over this many short sessions
    "active_hours": [9, 23],              # sessions only start between these hours
    "min_minutes_between_sessions": 45,
    "post_pause_seconds": [25, 90],       # "reading time" after each post
    "group_pause_seconds": [180, 600],    # pause when switching group inside a session
    "max_scrolls_per_session": 8,
    "stop_after_known_posts": 3,
    "chronological_feed": True,
    "gemini_model": "gemini-2.5-flash",
    "llm_min_seconds_between_calls": 7,
    "llm_max_calls_per_run": 150,
    "min_questions_for_article": 3,
    "reply_max_age_days": 3,
    "official_domains": ["ind.nl", "rijksoverheid.nl", "government.nl", "overheid.nl",
                         "uwv.nl", "belastingdienst.nl", "duo.nl", "svb.nl"],
}

# Windows consoles default to a code page that cannot print Arabic.
for _s in (sys.stdout, sys.stderr):
    try:
        _s.reconfigure(encoding="utf-8")
    except Exception:
        pass


def load_config() -> dict:
    cfg = dict(DEFAULTS)
    p = HERE / "config.json"
    if p.exists():
        cfg.update(json.loads(p.read_text(encoding="utf-8")))
    gfile = HERE / "groups.txt"          # the original handoff used groups.txt; still honoured
    if gfile.exists():
        extra = [l.strip() for l in gfile.read_text(encoding="utf-8").splitlines()
                 if l.strip() and not l.strip().startswith("#")]
        cfg["groups"] = list(dict.fromkeys(cfg["groups"] + extra))
    return cfg


def now() -> str:
    return dt.datetime.now().isoformat(sep=" ", timespec="seconds")


def today() -> str:
    return dt.date.today().isoformat()


def sha(*parts: str, n: int = 16) -> str:
    return hashlib.sha1("\x1f".join(parts).encode("utf-8")).hexdigest()[:n]


SCHEMA = """
CREATE TABLE IF NOT EXISTS posts(
    id TEXT PRIMARY KEY,
    group_url TEXT, post_url TEXT, text TEXT,
    scraped_at TEXT,
    analyzed INTEGER DEFAULT 0,
    is_question INTEGER,
    reply_status TEXT DEFAULT 'none'      -- none | drafted | posted | skipped
);
CREATE TABLE IF NOT EXISTS comments(
    id TEXT PRIMARY KEY,
    post_id TEXT REFERENCES posts(id),
    text TEXT,
    screenshot TEXT,                      -- private path under data/screenshots, never published
    kind TEXT,                            -- official_claim | experience | noise
    summary TEXT,                         -- anonymized one-line summary (the only thing articles use)
    outcome TEXT,                         -- worked | did_not_work | unknown
    verdict TEXT                          -- match | contradict | not_covered (set by verify.py)
);
CREATE TABLE IF NOT EXISTS clusters(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,                           -- canonical question in Arabic
    keywords TEXT,
    n_questions INTEGER DEFAULT 0,
    article_url TEXT, video_url TEXT,
    matched_at TEXT,
    official_answer TEXT, sources TEXT, confidence TEXT, verified_at TEXT,
    draft_path TEXT, drafted_at TEXT
);
CREATE TABLE IF NOT EXISTS questions(
    post_id TEXT PRIMARY KEY REFERENCES posts(id),
    question TEXT,
    keywords TEXT,
    cluster_id INTEGER REFERENCES clusters(id)
);
CREATE TABLE IF NOT EXISTS runs(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    day TEXT, started_at TEXT, kind TEXT, note TEXT
);
"""


def db(path: Path | None = None) -> sqlite3.Connection:
    path = path or DB_PATH
    path.parent.mkdir(parents=True, exist_ok=True)
    con = sqlite3.connect(path)
    con.row_factory = sqlite3.Row
    con.executescript(SCHEMA)
    return con


# ---------- Arabic / Dutch text normalisation for matching ----------
_TASHKEEL = re.compile(r"[ؐ-ًؚ-ٰٟۖ-ۭـ]")
STOP = set("""
في من على الى إلى عن مع هل ما ماذا كيف كم لو اذا إذا او أو و يا انا أنا انت هو هي هذا هذه ذلك التي الذي
شي شو اي أي عند عندي بدي ممكن حدا احد أحد لي له لها كان يكون بس كل بعد قبل لا لم لن تم شباب يعطيكم العافية
مرحبا السلام عليكم سؤال استفسار الله
de het een en van in is op te voor met die dat er niet zijn ik je wat hoe kan ook aan bij of als
the a an of to and is for on in with how what can
""".split())


def norm(s: str) -> str:
    s = _TASHKEEL.sub("", s or "").lower()
    s = re.sub("[إأآا]", "ا", s)
    s = s.replace("ى", "ي").replace("ة", "ه").replace("ؤ", "و").replace("ئ", "ي")
    return s


def tokens(s: str) -> set[str]:
    toks = re.findall(r"[\w]+", norm(s))
    out = set()
    for t in toks:
        if len(t) < 3 or t in STOP or t.isdigit():
            continue
        if t.startswith("ال") and len(t) > 4:     # strip the Arabic article
            t = t[2:]
        out.add(t)
    return out


def write_text(path: Path, text: str) -> Path:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")
    return path
