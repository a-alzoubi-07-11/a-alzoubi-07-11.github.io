(() => {
  const visitorLoader = document.createElement('script');
  visitorLoader.src = '/assets/visitor-counter.js?v=1';
  visitorLoader.defer = true;
  document.head.appendChild(visitorLoader);
  if (document.getElementById("gids-chat-root")) return;

  const endpoint = "https://gidsnederland.a-alzoubi-07-11.workers.dev/chat";
  const root = document.createElement("div");
  root.id = "gids-chat-root";
  root.innerHTML = `
    <button id="gids-chat-launcher" type="button" aria-expanded="false" aria-controls="gids-chat-panel">
      <span aria-hidden="true">✦</span><span class="gids-chat-launch-label"></span>
    </button>
    <section id="gids-chat-panel" role="dialog" aria-label="Gids Nederland chat" hidden>
      <header class="gids-chat-head">
        <div><strong class="gids-chat-title"></strong><small class="gids-chat-subtitle"></small></div>
        <button id="gids-chat-close" type="button" aria-label="Close chat">×</button>
      </header>
      <div id="gids-chat-messages" role="log" aria-live="polite"></div>
      <div class="gids-chat-privacy"></div>
      <form id="gids-chat-form">
        <textarea id="gids-chat-input" rows="1" maxlength="1500"></textarea>
        <button id="gids-chat-send" type="submit"></button>
      </form>
    </section>`;
  document.body.appendChild(root);

  const style = document.createElement("style");
  style.textContent = `
    #gids-chat-root{--gc:#147d64;--gc-dark:#0c654f;--gc-border:#e5e7eb;--gc-text:#17202a;--gc-muted:#64748b;position:fixed;z-index:2147483000;inset-inline-end:20px;inset-block-end:calc(20px + env(safe-area-inset-bottom));font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:var(--gc-text);direction:inherit}
    #gids-chat-root *{box-sizing:border-box}
    #gids-chat-launcher{display:flex;align-items:center;gap:9px;border:0;border-radius:999px;background:var(--gc);color:#fff;padding:13px 19px;font:700 15px inherit;box-shadow:0 8px 28px #0f172a33;cursor:pointer}
    #gids-chat-launcher:hover{background:var(--gc-dark)}
    #gids-chat-launcher span:first-child{font-size:19px}
    #gids-chat-panel{position:absolute;inset-inline-end:0;inset-block-end:64px;width:min(370px,calc(100vw - 28px));height:min(520px,calc(100dvh - 110px));background:#fff;border:1px solid var(--gc-border);border-radius:20px;box-shadow:0 18px 60px #0f172a30;overflow:hidden;display:flex;flex-direction:column}
    #gids-chat-panel[hidden]{display:none}
    .gids-chat-head{display:flex;align-items:center;justify-content:space-between;gap:12px;background:var(--gc);color:#fff;padding:15px 17px}
    .gids-chat-head strong,.gids-chat-head small{display:block}
    .gids-chat-head strong{font-size:15px}
    .gids-chat-head small{font-size:12px;opacity:.86;margin-top:3px}
    #gids-chat-close{background:transparent;border:0;color:#fff;font-size:28px;line-height:1;cursor:pointer}
    #gids-chat-messages{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;background:#f8fafc}
    .gids-chat-message{max-width:88%;padding:10px 12px;border-radius:15px;white-space:pre-wrap;overflow-wrap:anywhere;font-size:14px;line-height:1.55}
    .gids-chat-message.bot{align-self:flex-start;background:#fff;border:1px solid var(--gc-border);border-end-start-radius:5px}
    .gids-chat-message.user{align-self:flex-end;background:#e4f4ee;border-end-end-radius:5px}
    .gids-chat-privacy{padding:7px 13px 0;color:var(--gc-muted);font-size:10px;line-height:1.4;background:#fff}
    #gids-chat-form{display:flex;align-items:flex-end;gap:8px;padding:10px 12px 12px;background:#fff}
    #gids-chat-input{flex:1;resize:none;max-height:90px;border:1px solid var(--gc-border);border-radius:12px;padding:10px 11px;font:14px inherit;line-height:1.4;outline:none}
    #gids-chat-input:focus{border-color:var(--gc)}
    #gids-chat-send{border:0;border-radius:11px;background:var(--gc);color:#fff;padding:10px 13px;font:700 13px inherit;cursor:pointer;min-height:40px}
    #gids-chat-send:disabled{opacity:.55;cursor:wait}
    #gids-chat-launcher{font-family:inherit;font-weight:700;font-size:14px;min-height:48px}
    #gids-chat-close{min-width:44px;min-height:44px}
    #gids-chat-input{min-width:0}
    #gids-chat-send{font-family:inherit;font-weight:700;font-size:13px}
    @media(max-width:700px){
      #gids-chat-root{inset-inline-end:12px;inset-block-end:calc(12px + env(safe-area-inset-bottom))}
      #gids-chat-launcher{width:54px;height:54px;min-height:54px;padding:0;justify-content:center;border-radius:50%;box-shadow:0 8px 26px #0f172a40}
      #gids-chat-launcher .gids-chat-launch-label{display:none}
      #gids-chat-launcher span:first-child{font-size:23px}
      #gids-chat-root[data-open="true"] #gids-chat-launcher{visibility:hidden}
      #gids-chat-panel{position:fixed;inset:auto 0 var(--gc-keyboard,0px) 0;width:100vw;max-width:100vw;height:min(650px,calc(var(--gc-viewport-height,100dvh) - 8px));max-height:calc(var(--gc-viewport-height,100dvh) - 8px);border-radius:22px 22px 0 0;box-shadow:0 -12px 44px #0f172a30}
      .gids-chat-head{padding:12px 16px}
      #gids-chat-messages{min-height:0}
      #gids-chat-form{padding:10px 12px calc(12px + env(safe-area-inset-bottom))}
      #gids-chat-input{font-size:16px;min-height:44px}
      #gids-chat-send{min-height:44px;font-size:14px}
    }
  `;
  document.head.appendChild(style);

  const $ = (selector) => root.querySelector(selector);
  const launcher = $("#gids-chat-launcher");
  const panel = $("#gids-chat-panel");
  const feed = $("#gids-chat-messages");
  const form = $("#gids-chat-form");
  const input = $("#gids-chat-input");
  const send = $("#gids-chat-send");
  const history = [];

  function isDutch() {
    const stored = (() => { try { return localStorage.getItem("mbo_site_lang"); } catch (_) { return ""; } })();
    return (document.documentElement.lang || stored || "ar").toLowerCase().startsWith("nl");
  }

  function localize() {
    const nl = isDutch();
    root.lang = nl ? "nl" : "ar";
    root.dir = nl ? "ltr" : "rtl";
    panel.setAttribute("aria-label", nl ? "Gids Nederland chat" : "محادثة مساعد Gids Nederland");
    launcher.setAttribute("aria-label", nl ? "Chat openen" : "افتح المحادثة");
    const welcome = feed.querySelector("[data-gids-welcome]");
    if (welcome) welcome.textContent = nl
      ? "Welkom! Stel je vraag in het Nederlands of Arabisch. Controleer belangrijke informatie altijd bij de officiële bron."
      : "أهلاً بك! اسأل بالعربية أو الهولندية. تحقّق من المعلومات المهمة دائماً عبر المصدر الرسمي.";
    $(".gids-chat-launch-label").textContent = nl ? "Chat met ons" : "اسأل المساعد";
    $(".gids-chat-title").textContent = nl ? "Gids Nederland assistent" : "مساعد Gids Nederland";
    $(".gids-chat-subtitle").textContent = nl ? "Vragen over Nederland? Stel ze hier." : "اسأل عن الدراسة والحياة في هولندا";
    $(".gids-chat-privacy").textContent = nl
      ? "De chat wordt naar Cloudflare AI gestuurd. Deel geen persoonlijke gegevens."
      : "تُرسل رسالتك إلى Cloudflare AI. لا ترسل بيانات شخصية.";
    $("#gids-chat-close").setAttribute("aria-label", nl ? "Chat sluiten" : "إغلاق المحادثة");
    input.placeholder = nl ? "Typ je vraag…" : "اكتب سؤالك هنا…";
    send.textContent = nl ? "Verstuur" : "إرسال";
  }

  function addMessage(text, who) {
    const item = document.createElement("div");
    item.className = "gids-chat-message " + who;
    item.textContent = text;
    feed.appendChild(item);
    feed.scrollTop = feed.scrollHeight;
  }

  localize();
  addMessage(
    isDutch()
      ? "Welkom! Stel je vraag in het Nederlands of Arabisch. Controleer belangrijke informatie altijd bij de officiële bron."
      : "أهلاً بك! اسأل بالعربية أو الهولندية. تحقّق من المعلومات المهمة دائماً عبر المصدر الرسمي.",
    "bot"
  );

  feed.firstElementChild?.setAttribute("data-gids-welcome", "");
  const langObserver = new MutationObserver(localize);
  langObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });

  launcher.addEventListener("click", () => {
    const open = panel.hidden;
    panel.hidden = !open;
    launcher.setAttribute("aria-expanded", String(open));
    root.dataset.open = String(open);
    if (open && window.innerWidth > 700) input.focus();
  });
  $("#gids-chat-close").addEventListener("click", () => {
    panel.hidden = true;
    launcher.setAttribute("aria-expanded", "false");
    root.dataset.open = "false";
    launcher.focus();
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text || send.disabled) return;
    input.value = "";
    input.style.height = "auto";
    history.push({ role: "user", content: text });
    addMessage(text, "user");
    send.disabled = true;
    send.textContent = isDutch() ? "…" : "…";

    const pending = document.createElement("div");
    pending.className = "gids-chat-message bot";
    pending.textContent = isDutch() ? "Even zoeken…" : "لحظة، أجهز الإجابة…";
    feed.appendChild(pending);
    feed.scrollTop = feed.scrollHeight;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history.slice(-8) }),
      });
      const data = await response.json();
      if (!response.ok || !data.reply) throw new Error(data.error || "Request failed");
      pending.remove();
      history.push({ role: "assistant", content: data.reply });
      addMessage(data.reply, "bot");
    } catch (_) {
      pending.textContent = isDutch()
        ? "Ik kan nu niet antwoorden. Probeer het later opnieuw."
        : "تعذّر الحصول على رد الآن. حاول مرة أخرى بعد قليل.";
    } finally {
      send.disabled = false;
      send.textContent = isDutch() ? "Verstuur" : "إرسال";
      input.focus();
    }
  });

  function updateViewport() {
    const viewport = window.visualViewport;
    if (!viewport) return;
    const occluded = Math.max(0, Math.round(window.innerHeight - viewport.height - viewport.offsetTop));
    root.style.setProperty("--gc-keyboard", (occluded > 150 ? occluded : 0) + "px");
    root.style.setProperty("--gc-viewport-height", Math.round(viewport.height) + "px");
  }
  window.visualViewport?.addEventListener("resize", updateViewport);
  window.visualViewport?.addEventListener("scroll", updateViewport);
  updateViewport();

  document.addEventListener("keydown", e => { if (e.key === "Escape" && !panel.hidden) $("#gids-chat-close").click(); });

  input.addEventListener("input", () => {
    input.style.height = "auto";
    input.style.height = Math.min(input.scrollHeight, 90) + "px";
  });
})();
