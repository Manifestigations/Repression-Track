import {
  renderCoverage,
  renderDeadlines,
  renderStatusMix,
  renderTimeline,
} from "./chart.ts";
import { PROCESSES, REFERENCES, TRIGGERS } from "./data.ts";
import { clear, daysBetween, fmtDate, h } from "./dom.ts";
import { EPISODES } from "./episodes.ts";
import {
  GLOSSARY,
  glossaryById,
  glossaryByKind,
  termsForCase,
  type GlossaryEntry,
  type GlossaryKind,
} from "./glossary.ts";
import type { Lang } from "./i18n.ts";
import { t } from "./i18n.ts";
import { htmlLang, persistLang } from "./lang.ts";
import type { Process, Scope, Stage, Status, Tier } from "./model.ts";
import {
  TODAY,
  daysUntil,
  nextDeadline,
  sortByUrgency,
  stats,
  statusClass,
  urgencyOf,
  verdictClass,
} from "./model.ts";
import { NOTES, SANCTIONS } from "./notes.ts";
import { SOURCES } from "./sources.ts";

interface State {
  scope: Scope | "all";
  tier: Tier | "all";
  stage: Stage | "all";
  status: Status | "all";
  query: string;
  onlyUnverified: boolean;
  onlyOpen: boolean;
}

const STATE: State = {
  scope: "all",
  tier: "all",
  stage: "all",
  status: "all",
  query: "",
  onlyUnverified: false,
  onlyOpen: false,
};

const STAGES: Stage[] = [
  "ban",
  "refere",
  "fond",
  "controle",
  "interpellation",
  "enquete",
  "poursuite",
  "audience",
  "condamnation",
  "appel",
  "mesure",
  "indemnite",
  "parlementaire",
  "circulaire",
];

const STATUSES: Status[] = [
  "rejet",
  "accueil",
  "encours",
  "averifier",
  "clos",
  "sansobjet",
];

let currentLang: Lang = "en";

function filtered(): Process[] {
  const q = STATE.query.trim().toLowerCase();
  return PROCESSES.filter((p) => {
    if (STATE.scope !== "all" && p.scope !== STATE.scope) return false;
    if (STATE.tier !== "all" && p.tier !== STATE.tier) return false;
    if (STATE.stage !== "all" && p.stage !== STATE.stage) return false;
    if (STATE.status !== "all" && p.status !== STATE.status) return false;
    if (STATE.onlyUnverified && !p.unverified) return false;
    if (STATE.onlyOpen && p.status !== "encours" && p.status !== "averifier")
      return false;
    if (!q) return true;
    return (
      p.ref.toLowerCase().includes(q) ||
      p.title.toLowerCase().includes(q) ||
      p.forum.toLowerCase().includes(q) ||
      p.note.toLowerCase().includes(q) ||
      (p.city ?? "").toLowerCase().includes(q) ||
      (p.dept ?? "").toLowerCase().includes(q)
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
        h("div", {
          class: "flag",
          text: `${past.label} — ${t(currentLang, "overdue")}`,
        }),
      );
    }
    return h("td", null, h("span", { class: "flag", text: "—" }));
  }
  return h(
    "td",
    { title: n.basis },
    h("div", { class: "dl", text: fmtDate(n.date, currentLang) }),
    h("div", {
      class: "conf",
      text: `${n.label} · ${t(currentLang, n.confidence)}`,
    }),
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
      p.unverified
        ? h("div", { class: "flag", text: "▲ unverified — not opened" })
        : null,
    ),
    h(
      "td",
      null,
      h("div", { text: p.city ?? "—" }),
      h("span", { class: "conf", text: p.dept ? `dept ${p.dept}` : p.scope }),
    ),
    h("td", null, h("span", { class: "conf", text: t(currentLang, p.stage) })),
    h(
      "td",
      null,
      h("span", {
        class: statusClass(p.status),
        text: t(currentLang, p.status),
      }),
      p.verdict
        ? h(
            "div",
            { style: "margin-top:4px" },
            h("span", {
              class: verdictClass(p.verdict),
              text: t(currentLang, `v_${p.verdict}`),
            }),
          )
        : null,
      h(
        "div",
        { class: "chips" },
        ...termsForCase(p)
          .slice(0, 4)
          .map((e) =>
            h("button", {
              class: "chip-mini",
              text: e.term,
              title: e.plain,
              onClick: (ev: Event) => {
                ev.preventDefault();
                document
                  .getElementById(`gl-${e.id}`)
                  ?.scrollIntoView({ behavior: "smooth", block: "center" });
                document.getElementById(`gl-${e.id}`)?.classList.add("flash");
              },
            }),
          ),
      ),
    ),
    deadlineCell(p),
    countdownCell(p),
    h("td", {
      class: "dl",
      text: p.resolved ? fmtDate(p.resolved, currentLang) : "—",
    }),
  );
}

function kpiCard(
  n: string | number,
  label: string,
  tone?: string,
): HTMLElement {
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
    : [
        h(
          "tr",
          null,
          h("td", {
            colspan: 8,
            class: "empty",
            text: t(currentLang, "noRows"),
          }),
        ),
      ];

  return h(
    "div",
    { class: "panel" },
    h(
      "h2",
      null,
      `${t(currentLang, "filters")} — ${rows.length}/${PROCESSES.length}`,
    ),
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
            h("th", { text: t(currentLang, "colPlace") }),
            h("th", { text: t(currentLang, "colStage") }),
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
  type Item = {
    ref: string;
    label: string;
    date: string;
    basis: string;
    confidence: string;
    days: number;
  };
  const items: Item[] = [];
  for (const p of PROCESSES) {
    for (const d of p.deadlines) {
      if (d.closed) continue;
      items.push({
        ref: p.ref,
        label: d.label,
        date: d.date,
        basis: d.basis,
        confidence: d.confidence,
        days: daysUntil(d.date),
      });
    }
  }
  const sorted = items.sort((a, b) => a.date.localeCompare(b.date));

  const rows = sorted.map((d) => {
    const u = urgencyOf(d.days);
    return h(
      "div",
      { class: "row", title: d.basis },
      h("div", {
        class: "d",
        text: d.date.slice(8, 10) + "/" + d.date.slice(5, 7),
      }),
      h(
        "div",
        { class: "t" },
        `${d.label} — ${d.ref}`,
        h("small", { text: d.basis }),
        h("small", {
          class: `conf cd ${u}`,
          text:
            d.days < 0
              ? t(currentLang, "overdue")
              : `${d.days} ${t(currentLang, "day")} · ${t(currentLang, d.confidence)}`,
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
      h("div", {
        class: "d",
        text: tr.date.slice(8, 10) + "/" + tr.date.slice(5, 7),
      }),
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
        ...NOTES.map((n) =>
          h("li", null, h("b", { text: n.title }), ` — ${n.body}`),
        ),
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
      h(
        "ul",
        { class: "notes" },
        ...SANCTIONS.map((s) => h("li", { text: s })),
      ),
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
          h(
            "tr",
            null,
            h("th", { text: "Ref." }),
            h("th", { text: "Date" }),
            h("th", { text: "Forum" }),
            h("th", { text: "Holding" }),
          ),
        ),
        h(
          "tbody",
          null,
          ...REFERENCES.map((r) =>
            h(
              "tr",
              null,
              h(
                "td",
                { class: "ref" },
                r.ref,
                r.weight === "non-ouvert"
                  ? h("div", { class: "flag", text: "▲" })
                  : null,
              ),
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

function glossaryEntryRow(e: GlossaryEntry): HTMLElement {
  return h(
    "details",
    { class: "gl-item", id: `gl-${e.id}` },
    h(
      "summary",
      null,
      h("b", { text: e.term }),
      e.fr ? h("span", { class: "gl-fr", text: e.fr }) : null,
    ),
    h("p", { class: "gl-plain", text: e.plain }),
    e.french ? h("p", { class: "gl-fr-note", text: e.french }) : null,
    e.law
      ? h("p", {
          class: "gl-law",
          text: `${t(currentLang, "glossaryLaw")}: ${e.law}`,
        })
      : null,
    e.where
      ? h("p", {
          class: "gl-where",
          text: `${t(currentLang, "glossaryWhere")}: ${e.where}`,
        })
      : null,
    e.see && e.see.length
      ? h(
          "p",
          { class: "gl-see" },
          `${t(currentLang, "glossarySee")}: `,
          ...e.see.map((id, i) => {
            const target = glossaryById(id);
            return target
              ? h("a", {
                  href: `#gl-${id}`,
                  text: target.term,
                  onClick: (ev: Event) => {
                    ev.preventDefault();
                    document
                      .getElementById(`gl-${id}`)
                      ?.scrollIntoView({ behavior: "smooth" });
                  },
                })
              : null;
          }),
        )
      : null,
  );
}

function buildGlossary(): HTMLElement {
  const query = h("input", {
    type: "search",
    placeholder: t(currentLang, "glossarySearch"),
    onInput: (ev: Event) => {
      const q = (ev.target as HTMLInputElement).value.trim().toLowerCase();
      const blocks = document.querySelectorAll<HTMLElement>(".gl-block");
      blocks.forEach((b) => {
        const items = b.querySelectorAll<HTMLElement>(".gl-item");
        let any = false;
        items.forEach((it) => {
          const hit = !q || it.textContent?.toLowerCase().includes(q);
          it.style.display = hit ? "" : "none";
          if (hit) any = true;
        });
        b.style.display = any ? "" : "none";
      });
      const empty = document.getElementById("gl-empty");
      if (empty) {
        const visible = [
          ...document.querySelectorAll<HTMLElement>(".gl-item"),
        ].some((it) => it.style.display !== "none");
        empty.style.display = visible ? "none" : "";
      }
    },
  });

  const kinds: GlossaryKind[] = ["tracker", "general", "french"];
  const kindLabels: Record<GlossaryKind, string> = {
    tracker: t(currentLang, "glossaryKindTracker"),
    general: t(currentLang, "glossaryKindGeneral"),
    french: t(currentLang, "glossaryKindFrench"),
  };

  return h(
    "div",
    { class: "panel" },
    h("h2", null, t(currentLang, "glossary")),
    h("p", { class: "gl-intro", text: t(currentLang, "glossaryIntro") }),
    h("div", { class: "gl-search" }, query),
    h("div", { class: "gl-count", text: `${GLOSSARY.length} entrées` }),
    ...kinds.map((k) =>
      h(
        "div",
        { class: "gl-block" },
        h("h3", { class: `gl-h gl-${k}`, text: kindLabels[k] }),
        ...glossaryByKind(k).map(glossaryEntryRow),
      ),
    ),
    h("p", {
      id: "gl-empty",
      class: "gl-empty",
      style: "display:none",
      text: t(currentLang, "glossaryEmpty"),
    }),
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
          h(
            "li",
            null,
            h("a", {
              href: s.url,
              target: "_blank",
              rel: "noopener noreferrer",
              text: s.label,
            }),
          ),
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
      h(
        "div",
        { class: "chip", title: e.detail },
        h("b", { text: e.label }),
        ` · ${e.detail}`,
      ),
    ),
  );
}

function select<T extends string>(
  value: T,
  options: [T, string][],
  onChange: (v: T) => void,
): HTMLSelectElement {
  const sel = h(
    "select",
    {
      onChange: (ev: Event) =>
        onChange((ev.target as HTMLSelectElement).value as T),
    },
    ...options.map(([v, label]) => h("option", { value: v, text: label })),
  );
  sel.value = value;
  return sel;
}

function buildControls(rerender: () => void): HTMLElement {
  const scopeSel = select<Scope | "all">(
    STATE.scope,
    [
      ["all", t(currentLang, "allScopes")],
      ["herault", t(currentLang, "herault")],
      ["occitanie", t(currentLang, "occitanie")],
      ["national", t(currentLang, "national")],
    ],
    (v) => {
      STATE.scope = v;
      rerender();
    },
  );

  const tierSel = select<Tier | "all">(
    STATE.tier,
    [
      ["all", t(currentLang, "allTiers")],
      ["admin", t(currentLang, "admin")],
      ["penal", t(currentLang, "penal")],
      ["indemn", t(currentLang, "indemn")],
    ],
    (v) => {
      STATE.tier = v;
      rerender();
    },
  );

  const stageSel = select<Stage | "all">(
    STATE.stage,
    [
      ["all", t(currentLang, "allStages")],
      ...STAGES.map((s) => [s, t(currentLang, s)] as [Stage, string]),
    ],
    (v) => {
      STATE.stage = v;
      rerender();
    },
  );

  const statusSel = select<Status | "all">(
    STATE.status,
    [
      ["all", t(currentLang, "allStatuses")],
      ...STATUSES.map((s) => [s, t(currentLang, s)] as [Status, string]),
    ],
    (v) => {
      STATE.status = v;
      rerender();
    },
  );

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
      STATE.scope = "all";
      STATE.tier = "all";
      STATE.stage = "all";
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
    h("label", { text: t(currentLang, "scope") }),
    scopeSel,
    h("label", { text: t(currentLang, "tier") }),
    tierSel,
    h("label", { text: t(currentLang, "stage") }),
    stageSel,
    h("label", { text: t(currentLang, "status") }),
    statusSel,
    search,
    h("label", { class: "toggle" }, unv, t(currentLang, "onlyUnverified")),
    h("label", { class: "toggle" }, open, t(currentLang, "onlyOpen")),
    reset,
    h("div", { class: "spacer" }),
    langBtn,
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
    colProcess: t(currentLang, "colProcess"),
  };
  for (const k of [...STATUSES, "herault", "occitanie", "national"]) {
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
        h(
          "div",
          null,
          `${t(currentLang, "asof")} `,
          h("strong", { text: fmtDate(TODAY, currentLang) }),
        ),
        h(
          "div",
          null,
          `${t(currentLang, "verified")} `,
          h("strong", { text: fmtDate(TODAY, currentLang) }),
        ),
      ),
    ),
    buildEpisodes(),
    h(
      "div",
      { class: "kpis" },
      kpiCard(s.total, t(currentLang, "kpiTotal")),
      kpiCard(s.herault, t(currentLang, "kpiHerault")),
      kpiCard(s.national + s.occitanie, t(currentLang, "kpiNational")),
      kpiCard(s.open, t(currentLang, "kpiOpen")),
      kpiCard(s.critical, t(currentLang, "kpiCritical"), "crit"),
      kpiCard(s.arrests, t(currentLang, "kpiArrests")),
      kpiCard(s.trials, t(currentLang, "kpiTrials")),
      kpiCard(s.bans, t(currentLang, "kpiBans")),
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
          h(
            "span",
            null,
            h("i", { style: "background:#4f8cff" }),
            t(currentLang, "admin"),
          ),
          h(
            "span",
            null,
            h("i", { style: "background:#ff6b6b" }),
            t(currentLang, "penal"),
          ),
          h(
            "span",
            null,
            h("i", { style: "background:#ffd166" }),
            t(currentLang, "indemn"),
          ),
        ),
      ),
      h(
        "div",
        { class: "grid" },
        h(
          "div",
          { class: "panel" },
          h("h2", null, t(currentLang, "deadlines")),
          h(
            "div",
            { class: "chart-wrap mid" },
            h("canvas", { id: "deadlines" }),
          ),
        ),
        h(
          "div",
          { class: "panel" },
          h("h2", null, t(currentLang, "statusMix")),
          h(
            "div",
            { class: "chart-wrap short" },
            h("canvas", { id: "statusMix" }),
          ),
        ),
      ),
    ),
    h(
      "div",
      { class: "grid split" },
      h(
        "div",
        { class: "panel" },
        h("h2", null, t(currentLang, "coverage")),
        h("div", { class: "chart-wrap mid" }, h("canvas", { id: "coverage" })),
      ),
      h(
        "div",
        { class: "grid" },
        h(
          "div",
          { class: "panel" },
          h("h2", null, t(currentLang, "caveats")),
          h(
            "div",
            { class: "body" },
            h(
              "ul",
              { class: "notes" },
              ...NOTES.map((n) =>
                h("li", null, h("b", { text: n.title }), ` — ${n.body}`),
              ),
            ),
          ),
        ),
        h(
          "div",
          { class: "panel" },
          h("h2", null, t(currentLang, "sanctions")),
          h(
            "div",
            { class: "body" },
            h(
              "ul",
              { class: "notes" },
              ...SANCTIONS.map((s) => h("li", { text: s })),
            ),
          ),
        ),
      ),
    ),
    h("div", { class: "grid split" }, buildReferences(), buildSources()),
    h("div", { class: "panel" }, buildGlossary()),
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
  renderCoverage(rows, labels);
}

export function start(lang: Lang): void {
  currentLang = lang;
  boot();
}
