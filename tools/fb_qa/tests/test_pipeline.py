"""Offline tests: no Facebook, no Gemini, no network.

    cd tools/fb_qa && python -m unittest discover tests
"""
from __future__ import annotations

import json
import re
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import common  # noqa: E402
import analyze, verify, articles, replies, gaps, site_index  # noqa: E402,E401

CFG = dict(common.DEFAULTS, min_questions_for_article=2, reply_max_age_days=3)


class FakeLLM:
    """Answers each prompt type with canned JSON, the way Gemini would."""
    def __init__(self):
        self.calls = 0
        self.budget = 999

    def json(self, prompt, temperature=0.2):
        self.calls += 1
        if prompt.startswith("You analyse posts"):
            out = []
            for pk in re.findall(r"^\[(p\d+)\] POST: (.*)$", prompt, re.M):
                key, text = pk
                if "للبيع" in text:
                    out.append({"post": key, "is_question": False, "question": "", "comments": []})
                    continue
                cks = re.findall(rf"\[({key}c\d+)\] COMMENT: (.*)", prompt)
                cm = []
                for ck, ct in cks:
                    if "متابعة" in ct:
                        cm.append({"c": ck, "kind": "noise", "summary": "", "outcome": "unknown"})
                    elif "قدمت" in ct:
                        cm.append({"c": ck, "kind": "experience", "outcome": "worked",
                                   "summary": "شخص قدّم طلب بدل الإيجار عبر الإنترنت ووصله الرد خلال شهر"})
                    else:
                        cm.append({"c": ck, "kind": "official_claim", "outcome": "unknown",
                                   "summary": "شخص قال إن بدل الإيجار لا يُعطى لمن يسكن في غرفة"})
                out.append({"post": key, "is_question": True,
                            "question": "كيف أقدم طلب بدل الإيجار (huurtoeslag) في هولندا؟",
                            "keywords": ["huurtoeslag", "بدل الإيجار"], "comments": cm})
            return out
        if prompt.startswith("Group questions"):
            keys = re.findall(r"^(q\d+): ", prompt, re.M)
            m = re.search(r"^(\d+): ", prompt, re.M)
            if m:
                return [{"q": k, "topic": int(m.group(1))} for k in keys]
            return [{"q": k, "new": "كيف أقدم طلب بدل الإيجار؟", "keywords": "huurtoeslag, بدل الإيجار"}
                    for k in keys]
        if prompt.startswith("For each topic"):
            out = []
            for tid, block in re.findall(r"TOPIC (\d+):(.*?)(?=TOPIC \d+:|\Z)", prompt, re.S):
                urls = re.findall(r"- (/\S+\.html) \|", block)
                hit = next((u for u in urls if "huurtoeslag" in u or "rent" in u), urls[0] if urls else None)
                out.append({"topic": int(tid), "article": hit})
            return out
        if prompt.startswith("Which official"):
            return {"urls": ["https://www.belastingdienst.nl/huurtoeslag", "https://scam.example.com/x"]}
        if prompt.startswith("You verify"):
            return {"official_answer": "تقدّم طلب بدل الإيجار (huurtoeslag) عبر موقع مصلحة الضرائب.",
                    "sources": ["S1"], "confidence": "high",
                    "comments": [{"c": "c1", "verdict": "not_covered"}, {"c": "c2", "verdict": "contradict"}]}
        if prompt.startswith("Write the official"):
            return {"slug": "Huurtoeslag Apply!", "title": "طلب بدل الإيجار", "description": "شرح",
                    "body": "## كيف تقدّم\nتقدّم عبر موقع مصلحة الضرائب."}
        raise AssertionError("unexpected prompt: " + prompt[:80])


def fake_fetch(url):
    return "Huurtoeslag", "Huurtoeslag aanvragen doet u via Mijn toeslagen. " * 20


class PipelineTest(unittest.TestCase):
    def setUp(self):
        self.tmp = Path(tempfile.mkdtemp())
        self.con = common.db(self.tmp / "t.db")
        for mod in (verify, replies, gaps):
            mod.OUT = self.tmp / "out"
        articles.DRAFTS = self.tmp / "drafts"
        articles.DATA = analyze.DATA = self.tmp
        (self.tmp / "screenshots").mkdir()
        self.shot = self.tmp / "screenshots" / "noise.png"
        self.shot.write_bytes(b"png")
        posts = [("a", "مرحبا شباب كيف بقدم على huurtoeslag؟"),
                 ("b", "سؤال عن بدل الإيجار huurtoeslag لاني ساكن جديد"),
                 ("c", "غسالة للبيع بحالة ممتازة في امستردام")]
        for pid, text in posts:
            self.con.execute("INSERT INTO posts(id, group_url, post_url, text, scraped_at) VALUES(?,?,?,?,?)",
                             (pid, "g", f"https://www.facebook.com/groups/1/posts/{pid}", text, common.now()))
        cm = [("a1", "a", "قدمت عن طريق الموقع واجاني الرد بعد شهر", None),
              ("a2", "a", "متابعة", "screenshots/noise.png"),
              ("b1", "b", "ما بيعطوك اذا ساكن بغرفة", None)]
        for cid, pid, text, shot in cm:
            self.con.execute("INSERT INTO comments(id, post_id, text, screenshot) VALUES(?,?,?,?)",
                             (cid, pid, text, shot))
        self.con.commit()

    def test_full_pipeline(self):
        llm = FakeLLM()
        stats = analyze.run(self.con, llm)
        self.assertEqual(stats["posts"], 3)
        q = self.con.execute("SELECT COUNT(*) FROM posts WHERE is_question=1").fetchone()[0]
        self.assertEqual(q, 2)
        # noise screenshot deleted, path cleared
        self.assertFalse(self.shot.exists())
        self.assertIsNone(self.con.execute("SELECT screenshot FROM comments WHERE id='a2'").fetchone()[0])
        # both questions in ONE topic
        cl = self.con.execute("SELECT * FROM clusters").fetchall()
        self.assertEqual(len(cl), 1)
        self.assertEqual(cl[0]["n_questions"], 2)
        self.assertTrue(cl[0]["article_url"], "topic should match a site guide")
        self.assertTrue(site_index.page_file(cl[0]["article_url"]).exists())

        res = verify.run(self.con, llm, CFG, fetch=fake_fetch)
        self.assertEqual(res[0]["status"], "verified")
        c = self.con.execute("SELECT * FROM clusters").fetchone()
        self.assertEqual(c["confidence"], "high")
        self.assertNotIn("scam.example.com", c["sources"])
        verdicts = dict(self.con.execute("SELECT id, verdict FROM comments WHERE verdict IS NOT NULL").fetchall())
        self.assertIn("contradict", verdicts.values())

        made = articles.run(self.con, llm, CFG)
        self.assertEqual(len(made), 1)
        md = Path(made[0]).read_text(encoding="utf-8")
        self.assertTrue(made[0].endswith("huurtoeslag-apply.md"))
        self.assertIn("## المصادر الرسمية", md)
        self.assertIn("خلال شهر", md)                       # experience kept
        self.assertNotIn("غرفة", md)                        # contradicting claim excluded
        self.assertNotIn("facebook.com", md)                # no post links in the public draft
        review = Path(made[0].replace(".md", ".review.md")).read_text(encoding="utf-8")
        self.assertIn("facebook.com/groups/1/posts/a", review)

        path = replies.run(self.con, CFG, seed=1)
        txt = Path(path).read_text(encoding="utf-8")
        self.assertIn("gidsnederland.nl", txt)
        self.assertEqual(txt.count("```text"), 2)
        self.assertIsNone(replies.run(self.con, CFG))       # already drafted: nothing new

        a, b = gaps.run(self.con)
        self.assertTrue(Path(b).exists())

    def test_gap_for_unknown_topic(self):
        self.con.execute("INSERT INTO clusters(title, n_questions) VALUES('سؤال بدون مقال', 4)")
        cid = self.con.execute("SELECT id FROM clusters").fetchone()[0]
        self.con.execute("INSERT INTO questions(post_id, question, cluster_id) VALUES('a','x',?)", (cid,))
        self.con.commit()
        a, _ = gaps.run(self.con)
        self.assertIn("سؤال بدون مقال", Path(a).read_text(encoding="utf-8"))

    def test_norm_and_official(self):
        self.assertEqual(common.norm("إقامة"), "اقامه")
        self.assertIn("ايجار", common.tokens("بدل الإيجار"))
        self.assertTrue(site_index.is_official("https://www.ind.nl/en/x", CFG["official_domains"]))
        self.assertTrue(site_index.is_official("https://www.gemeente-ede.nl/a", CFG["official_domains"]))
        self.assertFalse(site_index.is_official("https://ind.nl.evil.com/", CFG["official_domains"]))

    def test_parse_json(self):
        from llm import parse_json
        self.assertEqual(parse_json('```json\n{"a": 1}\n```'), {"a": 1})
        self.assertEqual(parse_json('sure: [1, 2] done'), [1, 2])


if __name__ == "__main__":
    unittest.main()
