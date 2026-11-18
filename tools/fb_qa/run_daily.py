"""Run the whole pipeline once (schedule this 1-2 times a day).

    python run_daily.py                 # scrape -> analyze -> verify -> articles -> replies -> gaps
    python run_daily.py --no-scrape     # only process what is already in the database
    python run_daily.py --jitter 45     # random 0-45 min delay first (recommended for scheduled runs)

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
    ap.add_argument("--jitter", type=int, default=0)
    ap.add_argument("--force", action="store_true", help="ignore the daily scrape limit")
    a = ap.parse_args()

    if not a.no_scrape:
        argv = (["--force"] if a.force else []) + (["--jitter", str(a.jitter)] if a.jitter else [])
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
