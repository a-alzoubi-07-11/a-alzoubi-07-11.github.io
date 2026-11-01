/* Beroep tool: fills a Dutch appeal letter from the form. Nothing is stored or sent anywhere. */
(function () {
  const TXT = window.BEROEP_TXT || {};
  const F = ["naam", "vnr", "kenmerk", "adres", "woonplaats", "daanvraag", "dbesluit", "dvergunning"];
  const $ = (id) => document.getElementById(id);
  const EXAMPLE = { naam: "Mohammed Voorbeeld", vnr: "0000000000", kenmerk: "0000000000", rbnr: "", adres: "Voorbeeldstraat 1, 1234 AB Enschede",
    tel: "06-00000000", woonplaats: "Enschede", daanvraag: "2025-11-10", dbesluit: "2026-10-20", dvandaag: "", dvergunning: "2021-04-15" };
  const kind = "lang"; let isExample = false;

  const today = () => { const d = new Date(); const p = (n) => String(n).padStart(2, "0"); return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`; };
  const fmt = (v) => { if (!v) return ""; const [y, m, d] = v.split("-"); return `${d}-${m}-${y}`; };
  const esc = (s) => s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
  const vals = () => { const o = {}; F.forEach((k) => (o[k] = $(k).value.trim())); o.dvandaag = today(); return o; };
  const v = (o, k, label, isDate) => ({ t: isDate ? fmt(o[k]) : o[k], label });

  function build(o) {
    const P = {
      naam: v(o, "naam", "[naam]"), vnr: v(o, "vnr", "[V-nummer]"), kenmerk: v(o, "kenmerk", "[zaaknummer IND]"),
      adres: v(o, "adres", "[adres]"), plaats: v(o, "woonplaats", "[plaats]"),
      aanvraag: v(o, "daanvraag", "[datum aanvraag]", true), besluit: v(o, "dbesluit", "[datum besluit]", true),
      vandaag: v(o, "dvandaag", "[datum]", true), vergunning: v(o, "dvergunning", "[datum]", true),
    };
    const ref = ["V-nummer {vnr}", "zaaknummer IND {kenmerk}"];
    const subj = `Beroep – afwijzing verblijfsvergunning asiel voor onbepaalde tijd – ${ref.join(" – ")}`;

    const head =
`Aan: Centraal Inschrijfbureau Vreemdelingenzaken
p/a Rechtbank Noord-Holland, Postbus 1621, 2003 BR Haarlem

Naam: {naam}
V-nummer: {vnr}
Zaaknummer IND: {kenmerk}
Adres: {adres}

Betreft: beroep tegen het besluit van de minister van Asiel en Migratie (IND) van {besluit} (afwijzing aanvraag verblijfsvergunning asiel voor onbepaalde tijd)

Geachte rechtbank,

`;
    const kort =
`Hierbij stel ik beroep in tegen het besluit van de IND van {besluit}, waarbij mijn aanvraag van {aanvraag} om een verblijfsvergunning asiel voor onbepaalde tijd is afgewezen. Een kopie van het besluit is bijgevoegd.

Ik ben het niet eens met dit besluit. Mijn aanvraag is ingediend vóór 12 juni 2026, toen ik aan alle voorwaarden voldeed. De nieuwe regels zijn zonder overgangsrecht op mij toegepast. Dit is in strijd met de rechtszekerheid, het vertrouwensbeginsel en het gelijkheidsbeginsel.

De volledige gronden stuur ik na binnen de termijn die de rechtbank mij geeft.
`;
    const lang =
`Hierbij stel ik beroep in tegen het bovengenoemde besluit, waarbij mijn aanvraag van {aanvraag} om een verblijfsvergunning asiel voor onbepaalde tijd is afgewezen. Een kopie van het besluit is bijgevoegd.

1. Feiten
Ik heb sinds {vergunning} een verblijfsvergunning asiel voor bepaalde tijd. Op {aanvraag} heb ik een verblijfsvergunning asiel voor onbepaalde tijd aangevraagd en de leges betaald. Op dat moment voldeed ik aan alle wettelijke voorwaarden. Verweerder heeft niet binnen de wettelijke beslistermijn beslist. Pas op {besluit}, ná de inwerkingtreding van de Uitvoerings- en implementatiewet Asiel- en migratiepact 2026 op 12 juni 2026, heeft verweerder de aanvraag afgewezen met als enige reden dat de verblijfsvergunning asiel voor onbepaalde tijd per die datum is afgeschaft.

2. Gronden van het beroep
2.1 Strijd met rechtszekerheid en het vertrouwensbeginsel (geen overgangsrecht). Op de datum van mijn aanvraag gold het recht op grond waarvan ik een vergunning voor onbepaalde tijd kon verkrijgen. Ik mocht erop vertrouwen dat mijn aanvraag aan dat recht zou worden getoetst. De nieuwe regels zijn zonder enige overgangsregeling direct toegepast op aanvragen die al vóór 12 juni 2026 waren ingediend. Dit is in strijd met de algemene beginselen van rechtszekerheid en gerechtvaardigd vertrouwen, die ook als algemene beginselen van Unierecht gelden nu de wetswijziging verband houdt met de uitvoering van het Asiel- en migratiepact.

2.2 De overschrijding van de beslistermijn komt voor rekening van verweerder. Als verweerder binnen de wettelijke beslistermijn had beslist, had dat vóór 12 juni 2026 moeten gebeuren en was de vergunning verleend. Een bestuursorgaan mag geen voordeel halen uit het niet tijdig beslissen; de gevolgen daarvan mogen niet op mij worden afgewenteld. Het besluit is daarom ook in strijd met het zorgvuldigheidsbeginsel (artikel 3:2 Awb) en het verbod van willekeur.

2.3 Strijd met het gelijkheidsbeginsel. Vreemdelingen die op hetzelfde moment als ik een aanvraag deden en wier aanvraag toevallig vóór 12 juni 2026 werd beslist, hebben wél een vergunning voor onbepaalde tijd gekregen. Het moment waarop verweerder toevallig beslist, mag niet bepalend zijn voor mijn rechtspositie (artikel 1 Grondwet).

2.4 Onvoldoende motivering en onevenredigheid. Het besluit bevat een standaardmotivering zonder beoordeling van mijn persoonlijke situatie en zonder belangenafweging. Verweerder heeft niet gemotiveerd waarom de nadelige gevolgen voor mij in verhouding staan tot het doel van de wetswijziging (artikelen 3:4, tweede lid, en 3:46 Awb).

2.5 Voorbehoud. Ik behoud mij het recht voor de gronden aan te vullen binnen de termijn die de rechtbank mij geeft.

3. Verzoek
Ik verzoek de rechtbank het beroep gegrond te verklaren, het besluit te vernietigen, verweerder op te dragen een nieuw besluit te nemen waarbij mijn aanvraag wordt beoordeeld naar het recht zoals dat gold op de datum van de aanvraag, en verweerder te veroordelen in de proceskosten.
`;
    const tail =
`
Bijlagen: ingevuld en ondertekend beroepschrift-formulier, kopie besluit IND (alle pagina's), bewijs van betaling van de leges${kind === "lang" ? ", kopie verblijfsdocument" : ""}.

Met vriendelijke groet,

{naam}
{plaats}, {vandaag}`;
    return { subj, body: head + (kind === "kort" ? kort : lang) + tail, P };
  }

  function render(tpl, P, html) {
    let missing = 0;
    const out = tpl.replace(/\{(\w+)\}/g, (m, k) => {
      const p = P[k]; if (!p) return m;
      if (!p.t) { missing++; return html ? `<mark class="miss">${esc(p.label)}</mark>` : p.label; }
      return html ? `<mark>${esc(p.t)}</mark>` : p.t;
    });
    return { out, missing };
  }

  function update() {
    const { subj, body, P } = build(vals());
    const s = render(esc(subj), P, true), b = render(esc(body), P, true);
    $("out-subj").innerHTML = s.out;
    $("out-body").innerHTML = b.out;
    const miss = s.missing + b.missing;
    $("missing-hint").textContent = miss ? (TXT.missing || "").replace("{n}", miss) : TXT.complete || "";
  }

  function fill(o) { F.forEach((k) => ($(k).value = o[k] || "")); }
  function toast(msg) { const t = $("toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toast.h); toast.h = setTimeout(() => t.classList.remove("show"), 1800); }
  async function copy(text, okMsg, el) {
    try { await navigator.clipboard.writeText(text); toast(okMsg); }
    catch (e) { const r = document.createRange(); r.selectNodeContents(el); const s = getSelection(); s.removeAllRanges(); s.addRange(r); toast(TXT.selected || ""); }
  }
  function setExample(on) { isExample = on; $("example-flag").hidden = !on; }

  function init() {
    $("copy-subj").addEventListener("click", () => { const { subj, P } = build(vals()); copy(render(subj, P, false).out, TXT.copied_subj, $("out-subj")); });
    $("copy-body").addEventListener("click", () => { const { body, P } = build(vals()); copy(render(body, P, false).out, TXT.copied_body, $("out-body")); });
    $("btn-example").addEventListener("click", () => { fill(EXAMPLE); setExample(true); update(); });
    $("btn-clear").addEventListener("click", () => { fill({}); setExample(false); update(); $("naam").focus(); toast(TXT.cleared); });
    $("form").addEventListener("input", () => { if (isExample) setExample(false); update(); });
    $("form").addEventListener("submit", (e) => e.preventDefault());
    fill({}); setExample(false); update();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
