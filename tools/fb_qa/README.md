# fb_qa: questions from Facebook groups → verified answers, article drafts, reply drafts, video ideas

> **بالعربي باختصار:** أداة تعمل على جهازك فقط. تقرأ منشورات مجموعات الفيسبوك ببطء بحسابك أنت،
> تستخرج الأسئلة المتكررة، تتحقق من الأجوبة من المواقع الرسمية الهولندية، تكتب مسودات مقالات عربية
> (الجواب الرسمي + تجارب الناس بدون أسماء)، تجهّز ردوداً فيها رابط المقال/الفيديو **تنشرها أنت يدوياً**،
> وتعطيك قائمة بالمواضيع التي ليس لها مقال أو فيديو بعد، مرتبة حسب عدد مرات السؤال. كل شيء مجاني.

Everything here is free and local: Playwright with your own logged-in browser, SQLite, and the
Gemini API free tier. This folder is under `tools/`, which `_config.yml` excludes from the
website. All scraped data, screenshots, drafts and the login profile are git-ignored, so they
are never committed or published.

## Install on Windows: one line

Open **PowerShell** (Start menu → type `PowerShell` → Enter) and paste:

```powershell
irm https://raw.githubusercontent.com/a-alzoubi-07-11/a-alzoubi-07-11.github.io/claude/exciting-mayer-zodik4/tools/fb_qa/install.ps1 | iex
```

It installs Python if needed, then the program in `%USERPROFILE%\fb_qa`. It asks for your group
links and your free Gemini key, opens Facebook once so you can log in, creates the daily task
(08:50), and puts three shortcuts on the desktop: *results*, *run now* and *status*.
Paste the same line again later to update; settings and data are kept.

## Manual setup

```bash
cd tools/fb_qa
pip install -r requirements.txt
playwright install chromium
cp config.example.json config.json      # Windows: copy config.example.json config.json
```

1. Put your group URLs in `config.json` → `"groups"`. A `groups.txt` with one URL per line also works.
2. Get a free Gemini key at <https://aistudio.google.com/apikey> (no card needed) and set it as an
   environment variable, never in a file:
   - Windows: `setx GEMINI_API_KEY "your-key"` (then open a new terminal)
   - macOS/Linux: `export GEMINI_API_KEY=your-key` in `~/.bashrc`
3. First run: `python scraper.py`. A Chromium window opens; log in to Facebook by hand. The
   session is saved in `fb_profile/`, so later runs start logged in.

## Daily use

```bash
python run_daily.py
```

Start it **once a day, in the morning**. It makes a random plan for the day, for example
`10:42 (4), 13:17 (6), 18:55 (2), 21:08 (3)`: 3–5 short sessions at random times between 09:00 and
23:00, at least 45 minutes apart, reading **15 new posts in total, never more**. Between sessions
the browser is closed. When the last session ends, the analysis steps run.
`python scraper.py --plan-only` shows today's plan; `python scraper.py --now` runs one session now.

| Step | Module | LLM? | Output |
|---|---|---|---|
| 1 | `scraper.py`: new posts and comments. **Max 15 new posts per day across all groups** (no override), 3–5 sessions at random times, 1–2 random groups per session, 25–90 s per post, sometimes a 2–5 min break, 3–10 min when switching group, posts read before are not clicked again | no | `data/fb_groups.db`, `data/screenshots/` |
| 2 | `analyze.py`: question? clear Arabic question, comments sorted into rule / experience / noise with anonymized summaries, questions grouped into topics, topics matched to site guides and videos | yes | database |
| 3 | `verify.py`: fetches official pages (links cited in the matching guide first, then allowlisted domains only), writes the official answer, marks comments match / contradict / not_covered | yes | `out/contradictions_<date>.md` |
| 4 | `articles.py`: Arabic draft for verified topics asked ≥ 3 times | yes | `drafts/<slug>.md` + private `drafts/<slug>.review.md` |
| 5 | `replies.py`: reply drafts for new posts on topics you already cover | no | `out/replies_<date>.md` |
| 6 | `gaps.py`: topics with no guide/video, most-asked first | no | `out/gaps_<date>.md` / `.csv` |

Each module also runs on its own (`python verify.py --topic 12`, `python articles.py --topic 12`, ...).

Admin: `python manage.py stats | topics | show <id> | set-video <id> <url> | set-article <id> <path> |
merge <keep> <other> | posted <post_id> | skip <post_id> | purge-old <days>`.

After you publish new guides, rebuild the search index and run `python analyze.py --refresh-matches`
so topics link to them.

### Scheduling (Windows Task Scheduler)

Create a basic task, daily, **once**, at for example 08:50. The script picks the random session
times itself. Action: start a program.
- Program: `python`
- Arguments: `run_daily.py`
- Start in: `C:\path\to\repo\tools\fb_qa`

Keep "Run only when user is logged on" ticked. The browser must open visibly on your desktop
(it is not headless, by design).

## Rules built in

- **Replies are never posted automatically.** Auto-posting links gets accounts and groups banned.
- **Articles never show names.** Experiences come only from one-line anonymized summaries,
  listed as-is (nothing invented). Random replies (noise) and comments that contradict the
  official sources are left out. The `.review.md` file (post links, screenshots, original text)
  is for your own checking only.
- **Official facts come only from fetched official pages.** Topics with no answer, or low
  confidence, get no draft.
- Drafts are Markdown for review. To publish, turn one into a guide module following
  `tools/articles/README.md`, which keeps the site's rules: both languages, sources, labelled examples.
- **Daily limit:** `max_posts_per_day` (15) counts every new post saved today, in all groups and
  all runs together. Running the script again the same day only uses what is left.
- Free-tier pacing: about 8 LLM calls per minute, at most 150 per run (set in `config.json`).

## Things to know

- **Facebook terms:** automated reading is against Facebook's terms even with your own account.
  The 15-posts-a-day limit and random timing make problems unlikely but not impossible (a "checkpoint" or temporary block).
  If Facebook asks for verification, the scraper stops; log in by hand and lower the limits.
- **Privacy:** the database and screenshots contain other people's comments. They stay on your
  computer only. Run `python manage.py purge-old 90` now and then to delete raw text and
  screenshots older than 90 days. Topics, counts and anonymized summaries are kept.
- **Facebook's HTML changes often.** If `scraper.py` suddenly finds 0 posts, the selectors in
  its `JS_*` blocks need updating. `tests/test_scraper_dom.py` holds the mock markup they are
  tested against.

## Tests (offline: no Facebook, no Gemini)

```bash
python -m unittest discover tests
```
