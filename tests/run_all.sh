#!/bin/sh
# All checks: facts, site guard, search, letters, motivation letter, and (if a server runs on :8765) the checker scenarios.
set -e
cd "$(dirname "$0")/.."
python3 tools/check_facts.py
python3 .github/scripts/site_guard.py | tail -1
node tests/search.test.js
node tests/letters.test.js | tail -1
node tests/motivation.test.js | tail -1
if curl -s -o /dev/null http://localhost:8765/; then NODE_PATH=$(npm root -g) node tests/permres.e2e.js; else echo "skip permres.e2e.js (start: python3 -m http.server 8765)"; fi
