# How the site is protected

| Layer | What it protects against | Where |
|---|---|---|
| **Site guard** (every push, every PR, daily) | A page losing the calm design or site chrome, broken internal links/assets, broken JSON-LD, an article without its AR/NL twin, a broken sitemap, a shrunken or broken search index, an invalid news ticker, a changed `ads.txt`, a `robots.txt` that blocks Google, committed API keys/tokens, missing core files. Red cross on the commit + an alert issue (label `site-guard`) that closes itself when fixed. | `.github/workflows/site-guard.yml`, `.github/scripts/site_guard.py` |
| **Agents check before they publish** | The news agents and the freshness agent must run the guard and only push when it exits 0. | `docs/news-agents/PLAYBOOK.md`, `docs/freshness/PLAYBOOK.md` |
| **Branch protection on `main`** | Force-pushes that rewrite history and deletion of the `main` branch. Normal pushes from you and the bots still work. | GitHub settings (one-time, see below) |
| **Weekly snapshots** | Any accidental change: every Sunday `main` is frozen as a tag `backup-YYYY-MM-DD`; those tags cannot be deleted or moved. | `.github/workflows/backup.yml` + tag ruleset |
| **Secret scanning + push protection** | Pushing a real API key by mistake (GitHub blocks it). | GitHub settings (one-time, see below) |
| **Dependabot** | Outdated GitHub Actions used by the bots. | `.github/dependabot.yml` |

## Restore something

```bash
git fetch --tags
git tag -l 'backup-*'                                  # list snapshots
git checkout backup-2026-10-11 -- articles/student-finance.html nl/articles/student-finance.html
git commit -m "Restore student-finance from backup-2026-10-11" && git push
```

To undo one bad commit completely: `git revert <commit>` then push (never force-push).

## One-time settings only the owner can switch on (GitHub → repository → Settings)

1. **Branches → Add branch ruleset** (or *Add rule*) for `main`: tick **Block force pushes** and **Restrict deletions**. Leave everything else off so the bots can keep publishing.
2. **Rules → Rulesets → New tag ruleset** named "Protect backup snapshots", target `backup-*`, tick **Restrict deletions** and **Restrict updates**.
3. **Code security → Secret Protection**: enable **Secret scanning** and **Push protection**.
