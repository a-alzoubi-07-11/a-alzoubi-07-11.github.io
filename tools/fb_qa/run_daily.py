"""Run the whole pipeline for one day (schedule this ONCE a day, in the morning).

    python run_daily.py                 # start it once in the morning: reads up to 15 new posts in
                                        # 3-5 sessions at random times today, then analyze -> verify
                                        # -> articles -> replies -> gaps
    python run_daily.py --now           # one reading session now instead of the day plan
    python run_daily.py --no-scrape     # only process what is already in the database

Needs GEMINI_API_KEY in the environment for the analyze/verify/articles steps.
If the key is missing, scraping, replies and gaps still run.
"""
from __future__ import annotations

import argparse
import os

import scraper


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--no-scrape", action="store_true")
    ap.add_argument("--now", action="store_true", help="one session now instead of today's random plan")
    a = ap.parse_args()

    if not a.no_scrape:
        argv = ["--now"] if a.now else []
        try:
            scraper.main(argv)
        except SystemExit as e:
            if e.code not in (None, 0):
                print(f"scrape: {e.code}")

    if os.environ.get("GEMINI_API_KEY"):
        from llm import Gemini
        import analyze, verify, articles
        llm = Gemini()                      # one client = one shared call budget for the run
        print("analyze:", analyze.run(llm=llm))
        verify.run(llm=llm)
        articles.run(llm=llm)
        print(f"LLM calls used: {llm.calls}/{llm.budget}")
    else:
        print("GEMINI_API_KEY not set: skipping analyze/verify/articles.")

    import replies, gaps
    replies.run()
    gaps.run()


if __name__ == "__main__":
    main()
