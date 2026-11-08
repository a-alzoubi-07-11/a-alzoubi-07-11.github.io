#!/usr/bin/env python3
"""Check that guides and tools agree with data/facts.json (run by .github/scripts/site_guard.py).
Prints problems and exits 1 if any."""
import json, pathlib, re, sys
ROOT = pathlib.Path(__file__).resolve().parents[1]
F = json.loads((ROOT / "data/facts.json").read_text(encoding="utf-8"))["facts"]
problems = []
def need(path, *needles):
    t = (ROOT / path).read_text(encoding="utf-8")
    for n in needles:
        if n not in t:
            problems.append(f"{path}: missing «{n}» (data/facts.json)")
def forbid(path, *needles):
    t = (ROOT / path).read_text(encoding="utf-8")
    for n in needles:
        if n in t:
            problems.append(f"{path}: outdated «{n}» contradicts data/facts.json")
ar = lambda v: f"{v:,}"                 # 1,139
nl = lambda v: f"€ {v:,}".replace(",", ".")  # € 1.139
nat = F["ind.leges.naturalisation"]["values"]; perm = F["ind.leges.permanent"]["values"]
# the checker tool
js = (ROOT / "assets/permres-check.js").read_text(encoding="utf-8")
m = re.search(r"var LEGES = \{([^}]*)\}", js)
L = dict((k.strip(), int(v)) for k, v in re.findall(r"(\w+):\s*(\d+)", m.group(1))) if m else {}
want = {"adult": perm["regularOrEuAdult"], "minor": perm["regularOrEuMinor"], "tr": perm["asylumDocumentRenewal"],
        "trMinor": perm["asylumDocumentRenewalMinor"], "nat": nat["single"], "natPartner": nat["withPartner"],
        "natAsiel": nat["asylumOrStatelessSingle"], "natAsielPartner": nat["asylumOrStatelessWithPartner"]}
for k, v in want.items():
    if L.get(k) != v:
        problems.append(f"assets/permres-check.js: LEGES.{k} = {L.get(k)}, facts say {v}")
# the naturalisation guide (AR + NL)
for p in ("articles/dutch-naturalisation-guide.html", "tools/articles/modules/a_natural.py"):
    need(p, *(ar(nat[k]) for k in ("single", "withPartner", "asylumOrStatelessWithPartner")), "847")
    forbid(p, "صالحة لسنة على الأقل")
for p in ("nl/articles/dutch-naturalisation-guide.html",):
    need(p, *(nl(nat[k]) for k in ("single", "withPartner", "asylumOrStatelessWithPartner")))
    forbid(p, "minstens een jaar geldig")
forbid("assets/permres-check.js", "قد يُطلب منك التخلي عن جنسيتك (حماية ثانوية)", "bij subsidiaire bescherming kan afstand nodig zijn")
for p in problems:
    print("facts:", p)
sys.exit(1 if problems else 0)
