/* ============================================================
   comm-live.js - "The clarity scorer"
   learn-communication-with-phoebe

   Two modes over the same measurement code:

     REWRITE - a real Daybreak message, assembled from paragraph
       variants as you toggle levers. The text on screen genuinely
       changes, and every number is computed from that text.
     YOURS   - paste your own message. Same functions, same
       numbers, no levers, because nothing here can honestly
       rewrite a message it has never seen.

   What is MEASURED (real string analysis, not a rubric):
     average words per sentence, passive-voice hits, corporate
     abstraction hits, how many specifics (dates and numbers) are
     present, total length, and - the one that matters -
     WHICH SENTENCE YOUR ASK IS IN, out of how many.

   What is a MODEL: the weighting of those measurements into a
   score out of 100. The widget footer says so.

   The anti-lever "give them the full picture" adds a real
   paragraph of real background. Length goes up, the ask sinks,
   the score falls. Nothing is penalised for being thorough - the
   ask is simply further from the top, and that is measured.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- measurement ---------------------------------- */

  var JARGON = [
    "circle back", "going forward", "holistic", "ecosystem", "leverage",
    "synergy", "utilise", "utilize", "facilitate", "bandwidth", "workstream",
    "deliverable", "robust", "streamline", "actionable", "operationalise",
    "state of play", "knock-on", "as you will be aware", "at this moment in time",
    "reach out", "touch base", "moving forward", "in terms of", "piece of work",
    "value-add", "granular", "socialise", "align on", "double down"
  ];

  var PARTICIPLES = "ed|known|flagged|determined|scoped|understood|introduced|built|made|given|taken|seen|done|held|shipped|raised|identified|agreed|discussed|completed|delivered|impacted|driven|met";

  function sentences(text) {
    return String(text || "")
      .replace(/\s+/g, " ")
      .split(/(?<=[.!?])\s+/)
      .map(function (s) { return s.trim(); })
      .filter(function (s) { return s.length > 1; });
  }
  function words(text) {
    return String(text || "").trim().split(/\s+/).filter(function (w) { return /[a-z0-9]/i.test(w); });
  }

  function passiveHits(text) {
    /* allow one adverb between the be-verb and the participle: "was originally scoped" */
    var re = new RegExp("\\b(is|are|was|were|been|being|be)\\s+(?:\\w+ly\\s+)?(?:\\w+(?:" + PARTICIPLES + "))\\b", "gi");
    return (String(text).match(re) || []).length;
  }
  function jargonHits(text) {
    var low = String(text).toLowerCase(), n = 0, found = [];
    JARGON.forEach(function (j) {
      var c = low.split(j).length - 1;
      if (c > 0) { n += c; found.push(j); }
    });
    return { n: n, found: found };
  }
  /* specifics: dates, weekdays, months, plain numbers */
  function specifics(text) {
    var re = /\b(\d+(?:\.\d+)?%?|monday|tuesday|wednesday|thursday|friday|january|february|march|april|may|june|july|august|september|october|november|december)\b/gi;
    return (String(text).match(re) || []).length;
  }
  /* the ask: the first sentence that asks for a decision or an action */
  function askSentence(text) {
    var ss = sentences(text);
    var re = /\?|\b(i need|we need|please|can you|could you|decide|decision|approve|approval|sign off|confirm|let (?:me|us) know|would you like|whether you would|by (monday|tuesday|wednesday|thursday|friday|\d))\b/i;
    for (var i = 0; i < ss.length; i++) if (re.test(ss[i])) return { index: i + 1, total: ss.length, text: ss[i] };
    return { index: null, total: ss.length, text: null };
  }

  function measure(text) {
    var ss = sentences(text), ws = words(text);
    var ask = askSentence(text);
    var j = jargonHits(text);
    return {
      words: ws.length,
      sentences: ss.length,
      wps: ss.length ? ws.length / ss.length : 0,
      passive: passiveHits(text),
      jargon: j.n,
      jargonFound: j.found,
      specifics: specifics(text),
      ask: ask
    };
  }

  /* ---------- the model (weighting only) -------------------- */
  function score(m) {
    var parts = [];
    var p;

    if (m.ask.index === null) p = 0;
    else {
      var frac = m.ask.index / Math.max(1, m.ask.total);
      p = m.ask.index <= 2 ? 30 : frac <= 0.34 ? 20 : frac <= 0.67 ? 10 : 0;
    }
    parts.push(["Where the ask is", p, 30,
      m.ask.index === null ? "no ask found at all" : "sentence " + m.ask.index + " of " + m.ask.total]);

    p = m.wps <= 15 ? 20 : m.wps <= 20 ? 14 : m.wps <= 25 ? 7 : 0;
    parts.push(["Sentence length", p, 20, m.wps.toFixed(1) + " words per sentence"]);

    p = m.passive === 0 ? 15 : m.passive <= 2 ? 10 : m.passive <= 4 ? 5 : 0;
    parts.push(["Active voice", p, 15, m.passive + " passive construction" + (m.passive === 1 ? "" : "s")]);

    p = m.jargon === 0 ? 15 : m.jargon <= 2 ? 10 : m.jargon <= 4 ? 5 : 0;
    parts.push(["Plain words", p, 15, m.jargon + " abstraction" + (m.jargon === 1 ? "" : "s")]);

    p = m.specifics >= 3 ? 10 : m.specifics >= 1 ? 5 : 0;
    parts.push(["Specifics", p, 10, m.specifics + " date" + (m.specifics === 1 ? "" : "s") + " or number" + (m.specifics === 1 ? "" : "s")]);

    p = m.words <= 120 ? 10 : m.words <= 200 ? 5 : 0;
    parts.push(["Length", p, 10, m.words + " words"]);

    var total = parts.reduce(function (a, r) { return a + r[1]; }, 0);
    return { total: total, parts: parts };
  }

  /* ---------- the Daybreak message -------------------------- */

  var LEVERS = [
    { id: "askfirst", name: "Put the ask in the first sentence",
      hint: "The single biggest move available. Your reader decides whether to keep reading in about one sentence, and if the ask is at the bottom they are deciding without it." },
    { id: "short", name: "One idea per sentence",
      hint: "Long sentences are not sophisticated, they are unfinished. Splitting is almost always free - watch words-per-sentence fall without a single word being cut." },
    { id: "active", name: "Say who did what",
      hint: "\"It was determined\" hides the person. Passive voice on a delay reads as evasion even when none is intended, which is exactly the wrong impression to give upward." },
    { id: "dejargon", name: "Plain words instead of abstractions",
      hint: "Workstream, holistic, circle back, state of play. Each one is a word that sounds like work and carries no information, and the counter below finds them by name." },
    { id: "numbers", name: "Dates and numbers instead of adjectives",
      hint: "\"Looking challenging\" is not a status. \"18 September, now 9 October\" is. Specifics are what let somebody decide without asking you a follow-up." },
    { id: "cut", name: "Delete the paragraph nobody asked for",
      hint: "The opening that recaps what everyone already knows. It exists to warm you up, not to inform them, and it is the first thing to go." }
  ];

  var ANTI = { id: "context", name: "Add background so they have the full picture",
    hint: "Reasonable-sounding and reliably damaging. It is real background, honestly written - and it goes in front of everything, so the ask sinks and the length climbs. Thoroughness is not the problem. Position is." };

  var P = {
    context_base: "Following on from the discussions that were had at the last steering committee, I wanted to circle back and provide a holistic update on the current state of play regarding the subscription management workstream and the various dependencies that have been identified across the wider ecosystem.",
    context_plain: "This is an update on the subscription redesign, covering where it has got to and what has changed since the last steering committee.",
    context_short: "Here is where the subscription redesign stands.",
    context_base_split: "I wanted to circle back following the last steering committee. This is a holistic update on the current state of play for the subscription management workstream. It also covers the dependencies that have been identified across the wider ecosystem.",

    cause_base: "As you will be aware, a number of items were flagged by the engineering team, and it was subsequently determined that the migration piece is more involved than was originally scoped, which has had a knock-on effect on the timeline, and additional complexity was introduced by the payments integration.",
    cause_active: "The engineering team flagged several items and we then determined that the migration is more involved than we originally scoped, which affected the timeline, and the payments integration added further complexity.",
    cause_plain: "The payments integration turned out to be much bigger than we scoped, and that is what has moved the date.",
    cause_short: "The payments integration took three weeks longer than we scoped. That is the whole delay.",
    cause_base_split: "A number of items were flagged by the engineering team. It was subsequently determined that the migration piece is more involved than was originally scoped. This has had a knock-on effect on the timeline. Additional complexity was introduced by the payments integration.",
    cause_active_split: "The engineering team flagged several items. We then determined that the migration is more involved than we originally scoped. That affected the timeline, and the payments integration added further complexity.",

    status_base: "Some parts of the work have been completed and others have not been started as yet, and the original date is looking somewhat challenging at this moment in time.",
    status_numbers: "Pause is built and tested. Skip and change-frequency are not started. The original date was 18 September.",

    ask_base: "Going forward we will continue to monitor the situation and it would be appreciated if you could let us know in due course whether you would like us to proceed with the reduced scope or alternatively push the date.",
    ask_plain: "I need a decision from you by Thursday: ship on 18 September with pause only, or hold until 9 October and include skip and frequency.",

    extra: "For background, the subscription area was originally built in 2023 by a contractor and has been extended several times since, most recently when we added gift subscriptions. The payments provider changed its API in March, which we handled at the time with a compatibility layer that we have now had to unwind. There is also a longer-term question about whether this area should sit with the platform team rather than with us, which we do not need to resolve now but which is relevant context for the estimate."
  };

  function assemble(on) {
    var paras = [];

    if (on.context) paras.push(P.extra);

    if (on.askfirst) paras.push(on.dejargon ? P.ask_plain : P.ask_base);

    if (!on.cut) {
      paras.push(
        on.dejargon && on.short ? P.context_short :
        on.dejargon ? P.context_plain :
        on.short ? P.context_base_split : P.context_base
      );
    }

    paras.push(
      on.short && on.active && on.dejargon ? P.cause_short :
      on.dejargon ? P.cause_plain :
      on.active && on.short ? P.cause_active_split :
      on.active ? P.cause_active :
      on.short ? P.cause_base_split : P.cause_base
    );

    paras.push(on.numbers ? P.status_numbers : P.status_base);

    if (!on.askfirst) paras.push(on.dejargon ? P.ask_plain : P.ask_base);

    return paras.join("\n\n");
  }

  /* ---------- UI ------------------------------------------- */
  var CSS = [
    "#comm-live{margin:1.6rem 0}",
    ".cl{border:1px solid var(--hairline);border-radius:var(--radius);background:#fff;overflow:hidden}",
    ".cl-head{background:var(--indigo-deep);color:#fff;padding:.85rem 1.1rem;display:flex;gap:.8rem;align-items:center;flex-wrap:wrap}",
    ".cl-head h4{font-size:.95rem;font-weight:800;margin:0;flex:1;min-width:12rem}",
    ".cl-modes{display:flex;gap:.3rem;background:rgba(255,255,255,.14);padding:.22rem;border-radius:999px}",
    ".cl-modes button{border:0;background:transparent;color:#fff;font:700 .76rem Inter,sans-serif;padding:.3rem .8rem;border-radius:999px;cursor:pointer}",
    ".cl-modes button.on{background:var(--amber);color:var(--amber-ink)}",
    ".cl-body{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.1fr)}",
    "@media(max-width:840px){.cl-body{grid-template-columns:1fr}}",
    ".cl-left{padding:.9rem 1.1rem;border-right:1px solid var(--hairline)}",
    "@media(max-width:840px){.cl-left{border-right:0;border-bottom:1px solid var(--hairline)}}",
    ".cl-left h5,.cl-right h5{font-size:.72rem;text-transform:uppercase;letter-spacing:.09em;color:var(--muted);margin:0 0 .5rem}",
    ".cl-lv{display:block;padding:.42rem .5rem;border-radius:9px;cursor:pointer;font-size:.85rem;line-height:1.45}",
    ".cl-lv:hover{background:var(--indigo-50)}",
    ".cl-lv.on{background:var(--indigo-50)}",
    ".cl-lv.anti.on{background:#FEF2F2}",
    ".cl-lv input{margin-right:.5rem;accent-color:var(--indigo)}",
    ".cl-why{margin:.15rem 0 .5rem 1.45rem;padding:.5rem .65rem;border-left:3px solid var(--indigo-soft);background:var(--paper);font-size:.79rem;color:var(--muted);border-radius:0 8px 8px 0}",
    ".cl-lv.anti.on + .cl-why{border-left-color:#FCA5A5}",
    ".cl-btns{display:flex;gap:.4rem;margin-top:.7rem;flex-wrap:wrap}",
    ".cl-btns button{border:1px solid var(--hairline);background:#fff;border-radius:999px;padding:.3rem .8rem;font:700 .74rem Inter,sans-serif;color:var(--ink);cursor:pointer}",
    ".cl-btns button:hover{border-color:var(--indigo);color:var(--indigo)}",
    ".cl-msg{border:1px solid var(--hairline);border-radius:10px;background:#fff;padding:.85rem 1rem;font-size:.86rem;line-height:1.75;max-height:19rem;overflow:auto}",
    ".cl-msg p{margin:0 0 .7rem}",
    ".cl-msg p:last-child{margin-bottom:0}",
    ".cl-msg .askline{background:#FEF3C7;border-radius:4px;padding:0 .15rem;box-shadow:0 0 0 2px #FEF3C7}",
    ".cl-ta{width:100%;min-height:9rem;border:1px solid var(--hairline);border-radius:10px;padding:.75rem .9rem;font:400 .86rem/1.7 Inter,sans-serif;color:var(--ink);resize:vertical}",
    ".cl-right{padding:.9rem 1.1rem;background:var(--paper)}",
    ".cl-score{display:flex;align-items:baseline;gap:.6rem;margin:.8rem 0 .5rem}",
    ".cl-score b{font:800 2.1rem Inter,sans-serif;font-variant-numeric:tabular-nums;line-height:1}",
    ".cl-score span{font-size:.78rem;color:var(--muted);font-weight:600}",
    ".cl-part{display:grid;grid-template-columns:8.2rem 1fr 2.4rem;gap:.5rem;align-items:center;font-size:.76rem;margin-bottom:.24rem;color:var(--muted)}",
    ".cl-part .pbar{height:7px;border-radius:999px;background:var(--hairline);overflow:hidden}",
    ".cl-part .pfill{height:100%;background:var(--indigo);transition:width .28s ease}",
    ".cl-part.zero .pfill{background:#DC2626}",
    ".cl-part b{color:var(--ink);text-align:right;font-variant-numeric:tabular-nums}",
    ".cl-part i{display:block;font-style:normal;font-size:.71rem;opacity:.85}",
    ".cl-note{margin-top:.6rem;padding:.6rem .75rem;border-radius:9px;background:#fff;border:1px solid var(--hairline);font-size:.8rem;line-height:1.6}",
    ".cl-note b{color:var(--indigo-deep)}",
    ".cl-note.bad{background:#FEF2F2;border-color:#FCA5A5}",
    ".cl-note.bad b{color:#991B1B}",
    ".cl-foot{border-top:1px solid var(--hairline);padding:.6rem 1.1rem;font-size:.74rem;color:var(--muted);background:var(--paper)}"
  ].join("");

  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }

  function mount(host) {
    var st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);

    var on = {}, mode = "rewrite";
    LEVERS.forEach(function (l) { on[l.id] = false; });
    on[ANTI.id] = false;

    var shell = el("div", "cl");

    var head = el("div", "cl-head");
    head.appendChild(el("h4", null, "The clarity scorer · one message that keeps failing"));
    var modes = el("div", "cl-modes");
    var bRw = el("button", "on", "The Daybreak message");
    var bMine = el("button", null, "Paste your own");
    modes.appendChild(bRw); modes.appendChild(bMine);
    head.appendChild(modes);
    shell.appendChild(head);

    var body = el("div", "cl-body");
    var left = el("div", "cl-left");
    var leversWrap = el("div");
    leversWrap.appendChild(el("h5", null, "Rewrite levers"));
    var rows = {};
    LEVERS.concat([ANTI]).forEach(function (l) {
      var lab = el("label", "cl-lv" + (l === ANTI ? " anti" : ""));
      var cb = document.createElement("input"); cb.type = "checkbox";
      lab.appendChild(cb); lab.appendChild(document.createTextNode(l.name));
      var why = el("div", "cl-why", l.hint); why.style.display = "none";
      leversWrap.appendChild(lab); leversWrap.appendChild(why);
      rows[l.id] = { lab: lab, cb: cb, why: why };
      cb.addEventListener("change", function () { on[l.id] = cb.checked; paint(); });
    });
    var btns = el("div", "cl-btns");
    var bAll = el("button", null, "Switch every rewrite lever on");
    var bNone = el("button", null, "Back to the message as sent");
    btns.appendChild(bAll); btns.appendChild(bNone);
    leversWrap.appendChild(btns);
    left.appendChild(leversWrap);

    var mineWrap = el("div");
    mineWrap.style.display = "none";
    mineWrap.appendChild(el("h5", null, "Your message"));
    var ta = document.createElement("textarea");
    ta.className = "cl-ta";
    ta.placeholder = "Paste a real message you sent - a status update, a request, a piece of bad news. Nothing leaves your browser.";
    mineWrap.appendChild(ta);
    var mineNote = el("div", "cl-why", "No levers here, on purpose. Nothing can honestly rewrite a message it has never seen. The numbers are computed by exactly the same functions the Daybreak message uses.");
    mineWrap.appendChild(mineNote);
    left.appendChild(mineWrap);
    body.appendChild(left);

    var right = el("div", "cl-right");
    right.appendChild(el("h5", null, "The message, as it currently reads"));
    var msg = el("div", "cl-msg");
    right.appendChild(msg);
    var out = el("div");
    right.appendChild(out);
    body.appendChild(right);
    shell.appendChild(body);

    shell.appendChild(el("div", "cl-foot",
      "Every figure on the right is computed from the text on the left - sentence length, passive hits, abstraction hits, specifics, and which sentence your ask is in. Turning those six measurements into one score out of 100 is a stated rubric, written down in materials/official-course-map.md."));

    host.appendChild(shell);
    ta.addEventListener("input", paint);

    function renderMessage(text, ask) {
      msg.innerHTML = "";
      text.split(/\n\n+/).forEach(function (para) {
        var p = el("p");
        if (ask.text && para.indexOf(ask.text) !== -1) {
          var i = para.indexOf(ask.text);
          p.appendChild(document.createTextNode(para.slice(0, i)));
          p.appendChild(el("span", "askline", ask.text));
          p.appendChild(document.createTextNode(para.slice(i + ask.text.length)));
        } else {
          p.textContent = para;
        }
        msg.appendChild(p);
      });
    }

    function paint() {
      var isRw = mode === "rewrite";
      leversWrap.style.display = isRw ? "block" : "none";
      mineWrap.style.display = isRw ? "none" : "block";

      LEVERS.concat([ANTI]).forEach(function (l) {
        rows[l.id].lab.classList.toggle("on", !!on[l.id]);
        rows[l.id].why.style.display = on[l.id] ? "block" : "none";
      });

      var text = isRw ? assemble(on) : ta.value;
      if (!isRw && !text.trim()) {
        msg.innerHTML = "";
        msg.appendChild(el("p", null, "Paste something on the left and the numbers appear here."));
        out.innerHTML = "";
        api.measured = null; api.score = 0;
        return;
      }

      var m = measure(text);
      var sc = score(m);
      renderMessage(text, m.ask);

      out.innerHTML = "";
      var top = el("div", "cl-score");
      var b = el("b", null, String(sc.total));
      b.style.color = sc.total >= 80 ? "var(--indigo-deep)" : sc.total >= 50 ? "var(--ink)" : "#991B1B";
      top.appendChild(b);
      top.appendChild(el("span", null, "clarity, out of 100"));
      out.appendChild(top);

      sc.parts.forEach(function (p) {
        var row = el("div", "cl-part" + (p[1] === 0 ? " zero" : ""));
        var lab = el("span", null, p[0]);
        lab.appendChild(el("i", null, p[3]));
        row.appendChild(lab);
        var bar = el("div", "pbar"); var fill = el("div", "pfill");
        fill.style.width = (p[1] / p[2] * 100) + "%";
        bar.appendChild(fill); row.appendChild(bar);
        row.appendChild(el("b", null, p[1] + "/" + p[2]));
        out.appendChild(row);
      });

      var note = el("div", "cl-note");
      if (m.ask.index === null) {
        note.className = "cl-note bad";
        note.appendChild(el("b", null, "There is no ask in this message. "));
        note.appendChild(document.createTextNode("Nobody can act on it, so nobody will. This is the most common reason an update gets no reply."));
      } else if (on.context && isRw) {
        note.className = "cl-note bad";
        note.appendChild(el("b", null, "The background paragraph is on. "));
        note.appendChild(document.createTextNode("Every word of it is true and relevant. It is also " + m.words + " words in front of a reader who decides in one sentence, and your ask is now in sentence " + m.ask.index + " of " + m.ask.total + "."));
      } else {
        note.appendChild(el("b", null, "Your ask is in sentence " + m.ask.index + " of " + m.ask.total + ". "));
        note.appendChild(document.createTextNode(m.ask.index <= 2
          ? "A reader who stops after one sentence still knows what you want from them."
          : "A reader who stops before sentence " + m.ask.index + " never finds out what you wanted."));
      }
      out.appendChild(note);

      if (m.jargonFound.length) {
        var jn = el("div", "cl-note");
        jn.appendChild(el("b", null, "Abstractions found: "));
        jn.appendChild(document.createTextNode(m.jargonFound.join(", ")));
        out.appendChild(jn);
      }

      api.measured = m; api.score = sc.total; api.parts = sc.parts; api.text = text; api.mode = mode;
    }

    bRw.addEventListener("click", function () { mode = "rewrite"; bRw.classList.add("on"); bMine.classList.remove("on"); paint(); });
    bMine.addEventListener("click", function () { mode = "mine"; bMine.classList.add("on"); bRw.classList.remove("on"); paint(); });
    bAll.addEventListener("click", function () {
      LEVERS.forEach(function (l) { on[l.id] = true; rows[l.id].cb.checked = true; });
      on[ANTI.id] = false; rows[ANTI.id].cb.checked = false;
      paint();
    });
    bNone.addEventListener("click", function () {
      LEVERS.concat([ANTI]).forEach(function (l) { on[l.id] = false; rows[l.id].cb.checked = false; });
      paint();
    });

    var api = {
      state: on, score: 0, measured: null, parts: null, text: "", mode: "rewrite",
      set: function (id, v) { on[id] = v; if (rows[id]) rows[id].cb.checked = !!v; paint(); },
      setAll: function () { bAll.click(); },
      reset: function () { bNone.click(); },
      setMode: function (m) { (m === "mine" ? bMine : bRw).click(); },
      measure: measure, score: score, assemble: assemble, LEVERS: LEVERS, ANTI: ANTI
    };
    window.COMM_LIVE = api;

    paint();
  }

  if (typeof document !== "undefined") {
    var host = document.getElementById("comm-live");
    if (host) mount(host);
  }
  if (typeof module !== "undefined" && module.exports) {
    module.exports = { measure: measure, score: score, assemble: assemble, LEVERS: LEVERS };
  }
})();
