import { h, clear, fmtDate, daysBetween } from "./dom.ts";
import { t } from "./i18n.ts";
import type { Lang } from "./i18n.ts";
import { persistLang, htmlLang } from "./lang.ts";
import {
  TODAY,
  daysUntil,
  nextDeadline,
  openDeadlines,
  sortByUrgency,
  stats,
  urgencyOf,
  statusClass,
} from "./model.ts";
import type { Process, Status, Tier } from "./model.ts";
import { PROCESSES, REFERENCES, TRIGGERS } from "./data.ts";
import { EPISODES } from "./episodes.ts";
import { NOTES, SANCTIONS } from "./notes.ts";
import { SOURCES } from "./sources.ts";
import { renderTimeline, renderDeadlines, renderStatusMix } from "./chart.ts";

interface State {
  tier: Tier | "all";
  status: Status | "all";
  query: string;
  onlyUnverified: boolean;
  onlyOpen: boolean;
}

const STATE: State = {
  tier: "all",
  status: "all",
  query: "",
  onlyUnverified: false,
  onlyOpen: false,
};

let currentLang: Lang = "en";

function filtered(): Process[] {
  const q = STATE.query.trim().toLowerCase();
  return PROCESSES.filter((p) => {
    if (STATE.tier !== "all" && p.tier !== STATE.tier) return false;
    if (STATE.status !== "all" && p.status !== STATE.status) return false;
    if (STATE.onlyUnverified && !p.unverified) return false;
    if (STATE.onlyOpen && p.status !== "encours" && p.status !== "averifier") return false;
    if (!q) return true;
    return (
      p.ref.toLowerCase().includes(q) ||
      p.title.toLowerCase().includes(q) ||
      p.forum.toLowerCase().includes(q) ||
      p.note.toLowerCase().includes(q)
    );
  });
}

function countdownCell(p: Process): HTMLElement {
  const n = nextDeadline(p);
  if (!n) return h("td", { class: "cd past", text: "—" });
  const days = daysUntil(n.date);
  const u = urgencyOf(days);
  const text =
    days < 0 ? t(currentLang, "overdue") : `${days} ${t(currentLang, "day")}`;
  return h("td", { class: `cd ${u}`, text });
}

function deadlineCell(p: Process): HTMLElement {
  const n = nextDeadline(p);
  if (!n) {
    const past = p.deadlines.find((d) => d.closed);
    if (past) {
      return h(
        "td",
        null,
        h("div", { class: "dl", text: fmtDate(past.date, currentLang) }),
        h("div", { class: "flag", text: `${past.label} — ${t(currentLang, "overdue")}` }),
      );
    }
    return h("td", null, h("span", { class: "flag", text: "—" }));
  }
  const conf = t(currentLang, n.confidence);
  return h(
    "td",
    { title: n.basis },
    h("div", { class: "dl", text: fmtDate(n.date, currentLang) }),
    h("div", { class: "conf", text: `${n.label} · ${conf}` }),
  );
}

function row(p: Process): HTMLElement {
  return h(
    "tr",
    null,
    h("td", { class: "ref", text: p.ref }),
    h(
      "td",
      { class: "title" },
      h("b", { text: p.title }),
      h("span", { text: `${p.forum}${p.order ? ` · ${p.order}` : ""}` }),
      p.unverified ? h("div", { class: "flag", text: "▲ unverified — not opened" }) : null,
    ),
    h("td", null, h("span", { class: `pill tier-${p.tier}`, text: t(currentLang, p.tier) })),
    h("td", null, h("span", { class: statusClass(p.status), text: t(currentLang, p.status) })),
    deadlineCell(p),
    countdownCell(p),
    h("td", {
      class: "dl",
      text: p.resolved ? fmtDate(p.resolved, currentLang) : "—",
    }),
  );
}

function kpiCard(n: string | number, label: string, tone?: string): HTMLElement {
  return h(
    "div",
    { class: `kpi${tone ? ` ${tone}` : ""}` },
    h("div", { class: "n", text: String(n) }),
    h("div", { class: "l", text: label }),
  );
}

function buildTable(): HTMLElement {
  const rows = sortByUrgency(filtered());
  const body = rows.length
    ? rows.map(row)
    : [h("tr", null, h("td", { colspan: 7, class: "empty", text: t(currentLang, "noRows") }))];

  return h(
    "div",
    { class: "panel" },
    h("h2", null, `${t(currentLang, "filters")} — ${rows.length}/${PROCESSES.length}`),
    h(
      "div",
      { class: "body tight" },
      h(
        "table",
        null,
        h(
          "thead",
          null,
          h(
            "tr",
            null,
            h("th", { text: t(currentLang, "colRef") }),
            h("th", { text: t(currentLang, "colProcess") }),
            h("th", { text: t(currentLang, "colTier") }),
            h("th", { text: t(currentLang, "colStatus") }),
            h("th", { text: t(currentLang, "colNext") }),
            h("th", { text: t(currentLang, "colCountdown") }),
            h("th", { text: t(currentLang, "colResolved") }),
          ),
        ),
        h("tbody", null, ...body),
      ),
    ),
  );
}

function buildLedger(): HTMLElement {
  const items: { ref: string; label: string; date: string; basis: string; conf: string; days: number }[] = [];
  for (const p of PROCESSES) {
    for (const d of p.deadlines) {
      if (d.closed) continue;
      items.push({
        p: undefined as never,
        ref: p.ref,
        label: d.label,
        date: d.date,
        basis: d.basis,
        confidence: d.confidence,
        days: daysUntil(d.date),
      } as never);
    }
  }
  const sorted = (items as unknown as { ref: string; label: string; date: string; basis: string; confidence: string; days: number }[])
    .sort((a, b) => a.date.localeCompare(b.date));

  const rows = sorted.map((d) => {
    const u = urgencyOf(d.days);
    return h(
      "div",
      { class: "row", title: d.basis },
      h("div", { class: "d", text: d.date.slice(8, 10) + "/" + d.date.slice(5, 7) }),
      h(
        "div",
        { class: "t" },
        `${d.label} — ${d.ref}`,
        h("small", { text: d.basis }),
        h("small", {
          class: `conf cd ${u}`,
          text: d.days < 0 ? t(currentLang, "overdue") : `${d.days} ${t(currentLang, "day")} · ${t(currentLang, d.confidence)}`,
        }),
      ),
    );
  });

  return h(
    "div",
    { class: "panel" },
    h("h2", null, t(currentLang, "ledger")),
    h("div", { class: "ledger" }, ...rows),
  );
}

function buildTriggers(): HTMLElement {
  const rows = TRIGGERS.map((tr) => {
    const days = daysBetween(TODAY, tr.date);
    const u = urgencyOf(days);
    return h(
      "div",
      { class: "row" },
      h("div", { class: "d", text: tr.date.slice(8, 10) + "/" + tr.date.slice(5, 7) }),
      h(
        "div",
        { class: "t" },
        tr.label,
        h("small", {
          class: `conf cd ${u}`,
          text: `${t(currentLang, tr.kind)} · ${days} ${t(currentLang, "day")} · ${t(currentLang, tr.confidence)}`,
        }),
      ),
    );
  });
  return h(
    "div",
    { class: "panel" },
    h("h2", null, t(currentLang, "triggers")),
    h("div", { class: "ledger" }, ...rows),
  );
}

function buildNotes(): HTMLElement {
  return h(
    "div",
    { class: "panel" },
    h("h2", null, t(currentLang, "caveats")),
    h(
      "div",
      { class: "body" },
      h(
        "ul",
        { class: "notes" },
        ...NOTES.map((n) => h("li", null, h("b", { text: n.title }), ` — ${n.body}`)),
      ),
    ),
  );
}

function buildSanctions(): HTMLElement {
  return h(
    "div",
    { class: "panel" },
    h("h2", null, t(currentLang, "sanctions")),
    h(
      "div",
      { class: "body" },
      h("ul", { class: "notes" }, ...SANCTIONS.map((s) => h("li", { text: s }))),
    ),
  );
}

function buildReferences(): HTMLElement {
  return h(
    "div",
    { class: "panel" },
    h("h2", null, t(currentLang, "references")),
    h(
      "div",
      { class: "body tight" },
      h(
        "table",
        null,
        h(
          "thead",
          null,
          h("tr", null, h("th", { text: "Ref." }), h("th", { text: "Date" }), h("th", { text: "Forum" }), h("th", { text: "Holding" })),
        ),
        h(
          "tbody",
          null,
          ...REFERENCES.map((r) =>
            h(
              "tr",
              null,
              h("td", { class: "ref" }, r.ref, r.weight === "non-ouvert" ? h("div", { class: "flag", text: "▲" }) : null),
              h("td", { class: "dl", text: fmtDate(r.date, currentLang) }),
              h("td", { text: r.forum }),
              h("td", { text: r.holding }),
            ),
          ),
        ),
      ),
    ),
  );
}

function buildSources(): HTMLElement {
  return h(
    "div",
    { class: "panel" },
    h("h2", null, t(currentLang, "sources")),
    h(
      "div",
      { class: "body" },
      h(
        "ul",
        { class: "notes" },
        ...SOURCES.map((s) =>
          h("li", null, h("a", { href: s.url, target: "_blank", rel: "noopener noreferrer", text: s.label })),
        ),
      ),
    ),
  );
}

function buildEpisodes(): HTMLElement {
  return h(
    "div",
    { class: "episodes" },
    ...EPISODES.map((e) =>
      h("div", { class: "chip", title: e.detail }, h("b", { text: e.label }), ` · ${e.detail}`),
    ),
  );
}

function buildControls(rerender: () => void): HTMLElement {
  const tierSel = h(
    "select",
    {
      onChange: (ev: Event) => {
        STATE.tier = (e.target as HTMLSelectElement).value as Tier | "all";
        rerender();
      },
    },
    h("option", { value: "all", text: t(currentLang, "allTiers") }),
    h("option", { value: "admin", text: t(currentLang, "admin") }),
    h("option", { value: "penal", text: t(currentLang, "penal") }),
    h("option", { value: "indemn", text: t(currentLang, "indemn") }),
  );
  tierSel.value = STATE.tier;

  const statusSel = h(
    "select",
    {
      onChange: (ev: Event) => {
        STATE.status = (e.target as HTMLSelectElement).value as Status | "all";
        rerender();
      },
    },
    h("option", { value: "all", text: t(currentLang, "allStatuses") }),
    ...(["rejet", "accueil", "encours", "averifier", "clos", "sansobjet"] as Status[]).map((s) =>
      h("option", { value: s, text: t(currentLang, s) }),
    ),
  );
  statusSel.value = STATE.status;

  const search = h("input", {
    type: "search",
    placeholder: t(currentLang, "search"),
    value: STATE.query,
    onInput: (ev: Event) => {
      STATE.query = (ev.target as HTMLInputElement).value;
      rerender();
    },
  });

  const unv = h("input", {
    type: "checkbox",
    checked: STATE.onlyUnverified,
    onChange: (ev: Event) => {
      STATE.onlyUnverified = (ev.target as HTMLInputElement).checked;
      rerender();
    },
  });

  const open = h("input", {
    type: "checkbox",
    checked: STATE.onlyOpen,
    onChange: (ev: Event) => {
      STATE.onlyOpen = (ev.target as HTMLInputElement).checked;
      rerender();
    },
  });

  const reset = h("button", {
    class: "btn",
    text: t(currentLang, "reset"),
    onClick: () => {
      STATE.tier = "all";
      STATE.status = "all";
      STATE.query = "";
      STATE.onlyUnverified = false;
      STATE.onlyOpen = false;
      rerender();
    },
  });

  const langBtn = h("button", {
    class: "btn",
    text: currentLang === "en" ? "FR" : "EN",
    onClick: () => {
      currentLang = currentLang === "en" ? "fr" : "en";
      persistLang(currentLang);
      htmlLang(currentLang);
      boot();
    },
  });

  return h(
    "div",
    { class: "controls" },
    h("label", { text: t(currentLang, "tier") }),
    tierSel,
    h("label", { text: t(currentLang, "status") }),
    statusSel,
    search,
    h("label", { class: "toggle" }, unv, t(currentLang, "onlyUnverified")),
    h("label", { class: "toggle" }, open, t(currentLang, "onlyOpen")),
    reset,
    h("div", { class: "spacer" }),
    reset === null ? null : langBtn,
  );
}

function boot(): void {
  const app = document.getElementById("app");
  if (!app) return;
  clear(app);

  const rerender = (): void => boot();
  const rows = filtered();
  const s = stats(rows);
  const labels: Record<string, string> = {
    colNext: t(currentLang, "colNext"),
    day: t(currentLang, "day"),
  };
  for (const k of ["rejet", "accueil", "encours", "averifier", "clos", "sansobjet"]) {
    labels[k] = t(currentLang, k);
  }

  app.append(
    h(
      "header",
      { class: "top" },
      h(
        "div",
        { class: "brand" },
        h("h1", { text: t(currentLang, "title") }),
        h("p", { text: t(currentLang, "subtitle") }),
      ),
      h(
        "div",
        { class: "stamp" },
        h("div", null, `${t(currentLang, "asof")} `, h("strong", { text: fmtDate(TODAY, currentLang) })),
        h("div", null, `${t(currentLang, "verified")} `, h("strong", { text: fmtDate(TODAY, currentLang) })),
      ),
    ),
    buildEpisodes(),
    h(
      "div",
      { class: "kpis" },
      kpiCard(s.total, t(currentLang, "kpiTotal")),
      kpiCard(s.open, t(currentLang, "kpiOpen")),
      kpiCard(s.critical, t(currentLang, "kpiCritical"), "crit"),
      kpiCard(s.unverified, t(currentLang, "kpiUnverified"), "warn"),
    ),
    buildControls(rerender),
    h(
      "div",
      { class: "grid split" },
      buildTable(),
      h("aside", { class: "grid" }, buildLedger(), buildTriggers()),
    ),
    h(
      "div",
      { class: "grid charts" },
      h(
        "div",
        { class: "panel" },
        h("h2", null, t(currentLang, "timeline")),
        h("div", { class: "chart-wrap tall" }, h("canvas", { id: "timeline" })),
        h(
          "div",
          { class: "legend" },
          h("span", null, h("i", { style: "background:#4f8cff" }), t(currentLang, "admin")),
          h("span", null, h("i", { style: "background:#ff6b6b" }), t(currentLang, "penal")),
          h("span", null, h("i", { style: "background:#ffd166" }), t(currentLang, "indemn")),
        ),
      ),
      h(
        "div",
        { class: "grid" },
        h(
          "div",
          { class: "panel" },
          h("h2", null, t(currentLang, "deadlines")),
          h("div", { class: "chart-wrap mid" }, h("canvas", { id: "deadlines" })),
        ),
        h(
          "div",
          { class: "panel" },
          h("h2", null, t(currentLang, "statusMix")),
          h("div", { class: "chart-wrap short" }, h("canvas", { id: "statusMix" })),
        ),
      ),
    ),
    h("div", { class: "grid split" }, buildReferences(), h("aside", { class: "grid" }, buildSanctions(), buildNotes())),
    buildSources(),
    h(
      "footer",
      { class: "foot" },
      h("span", { text: t(currentLang, "footnote") }),
      h("span", { text: "src/client/data.ts" }),
    ),
  );

  renderTimeline(rows, labels);
  renderDeadlines(rows, labels);
  renderStatusMix(rows, labels);
}

export function start(lang: Lang): void {
  currentLang = lang;
  boot();
}
