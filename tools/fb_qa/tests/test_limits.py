"""Daily limit and random session plan (offline)."""
from __future__ import annotations

import datetime as dt
import random
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import common  # noqa: E402
import scraper  # noqa: E402

CFG = dict(common.DEFAULTS)


class LimitTest(unittest.TestCase):
    def test_plan_is_random_spaced_and_sums_to_quota(self):
        start = dt.datetime(2026, 11, 19, 8, 0)
        seen = set()
        for seed in range(300):
            plan = scraper.plan_day(CFG, start, 15, random.Random(seed))
            times = [t for t, _ in plan]
            quotas = [q for _, q in plan]
            self.assertEqual(sum(quotas), 15)
            self.assertTrue(all(q >= 1 for q in quotas))
            self.assertTrue(3 <= len(plan) <= 5)
            self.assertEqual(times, sorted(times))
            self.assertTrue(all(dt.datetime(2026, 11, 19, 9) <= t < dt.datetime(2026, 11, 19, 23) for t in times))
            self.assertTrue(all(b - a >= dt.timedelta(minutes=45) for a, b in zip(times, times[1:])))
            seen.add(tuple(t.strftime("%H:%M") for t in times))
        self.assertGreater(len(seen), 250, "times must differ from day to day")

    def test_plan_late_start_and_small_quota(self):
        late = scraper.plan_day(CFG, dt.datetime(2026, 11, 19, 22, 30), 15, random.Random(1))
        self.assertEqual(len(late), 1)                    # only room for one session
        self.assertEqual(late[0][1], 15)
        self.assertEqual(scraper.plan_day(CFG, dt.datetime(2026, 11, 19, 23, 30), 15), [])
        two = scraper.plan_day(CFG, dt.datetime(2026, 11, 19, 8), 2, random.Random(3))
        self.assertLessEqual(len(two), 2)
        self.assertEqual(sum(q for _, q in two), 2)
        self.assertEqual(scraper.plan_day(CFG, dt.datetime(2026, 11, 19, 8), 0), [])

    def test_quota_counts_all_groups_today(self):
        con = common.db(Path(tempfile.mkdtemp()) / "t.db")
        yday = (dt.datetime.now() - dt.timedelta(days=1)).isoformat(sep=" ", timespec="seconds")
        for i in range(10):
            con.execute("INSERT INTO posts(id, group_url, text, scraped_at) VALUES(?,?,?,?)",
                        (f"y{i}", "g1", "x", yday))
        for i in range(12):
            con.execute("INSERT INTO posts(id, group_url, text, scraped_at) VALUES(?,?,?,?)",
                        (f"t{i}", f"g{i % 3}", "x", common.now()))
        con.commit()
        self.assertEqual(scraper.posts_today(con), 12)
        self.assertEqual(scraper.quota_left(con, CFG), 3)
        for i in range(5):
            con.execute("INSERT INTO posts(id, group_url, text, scraped_at) VALUES(?,?,?,?)",
                        (f"z{i}", "g", "x", common.now()))
        self.assertEqual(scraper.quota_left(con, CFG), 0)
        self.assertEqual(scraper.run_session(con, CFG, 5), 0)   # refuses without opening a browser


if __name__ == "__main__":
    unittest.main()
