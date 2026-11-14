import { buildAtlasPanel } from "./atlas.ts";
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
  geoFor,
  geoLabel,
  geoOptions,
  geoPath,
  isNationalCase,
  matchesGeo,
} from "./geo.ts";
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
import type { Process, Stage, Status, Tier } from "./model.ts";
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
  /** id from src/client/geo.ts; "france" = every place */
  geo: string;
  tier: Tier | "all";
  stage: Stage | "all";
  status: Status | "all";
  query: string;
  onlyUnverified: boolean;
  onlyOpen: boolean;
}

const STATE: State = {
  geo: "france",
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

/**
 * Look a string up, but fall back to literal text if the key is not in
 * `i18n.ts` yet. Keeps the page readable while the geo strings are added.
 */
function tx(key: string, fallback: string): string {
  const v = t(currentLang, key) as string | undefined;
  return v && v !== key ? v : fallback;
}

function filtered(): Process[] {
  const q = STATE.query.trim().toLowerCase();
  return PROCESSES.filter((p) => {
    if (!matchesGeo(p, STATE.geo)) return false;
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
      (p.dept ?? "").toLowerCase().includes(q) ||
      geoLabel(geoFor(p), currentLang).toLowerCase().includes(q)
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
  const geo = geoFor(p);
  const national = isNationalCase(p);
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
      { title: geoPath(geo, currentLang) },
      h("div", { text: p.city ?? "—" }),
      national
        ? h("span", {
            class: "geo-badge",
            text: tx("geoNational", "Applies across all of France"),
          })
        : h("span", {
            class: "conf",
            text: p.dept ? `dept ${p.dept}` : p.scope,
          }),
      national
        ? null
        : h("div", { class: "geo-path", text: geoPath(geo, currentLang) }),
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

/**
 * Four-level place selector: France › region › department › city.
 * Options come from the data, so a region with no case never appears.
 *
 * Counts are geographic: national rows are subtracted, because they show up
 * under every filter and would otherwise inflate every branch of the tree.
 */
function buildGeoSelect(
  cases: Process[],
  rerender: () => void,
): HTMLSelectElement {
  const sel = h("select", {
    class: "geo-select",
    id: "geo-filter",
    onChange: (ev: Event) => {
      STATE.geo = (ev.target as HTMLSelectElement).value;
      rerender();
    },
  });

  const nationalCount = cases.filter(isNationalCase).length;
  const local = (n: number): number => Math.max(0, n - nationalCount);
  const depthPad = (d: number): string => "\u00A0\u00A0".repeat(d);

  sel.append(
    h("option", {
      value: "france",
      text: `${tx("geoAll", "All of France")} — ${cases.length}`,
    }),
  );

  const unplaced = cases.filter((c) => geoFor(c) === "non-attribue").length;
  if (unplaced) {
    sel.append(
      h("option", {
        value: "non-attribue",
        text: `${tx("geoUnplaced", "Not tied to one place")} — ${unplaced}`,
      }),
    );
  }

  const opts = geoOptions(cases, currentLang);
  const regions = opts.filter((o) => o.depth === 0);

  for (const region of regions) {
    const group = h("optgroup", { label: region.label });

    group.append(
      h("option", {
        value: region.id,
        text: `${region.label} — ${tx("geoRegion", "region")} (${local(region.count)})`,
      }),
    );

    for (const dept of opts.filter(
      (o) => o.depth === 1 && o.regionId === region.id,
    )) {
      group.append(
        h("option", {
          value: dept.id,
          text: `${depthPad(1)}${dept.label} — ${tx("geoDept", "department")} (${local(dept.count)})`,
        }),
      );

      for (const city of opts.filter(
        (o) => o.depth === 2 && o.parentId === dept.id,
      )) {
        group.append(
          h("option", {
            value: city.id,
            text: `${depthPad(2)}${city.label} — ${tx("geoCity", "city")} (${local(city.count)})`,
          }),
        );
      }
    }

    sel.append(group);
  }

  if (nationalCount) {
    sel.append(
      h("optgroup", {
        label: tx("geoNationalGroup", "Applies everywhere"),
      }),
    );
    sel.append(
      h("option", {
        value: "national",
        text: `${tx("geoNational", "Applies across all of France")} (${nationalCount})`,
      }),
    );
  }

  // Set after the options exist, so the choice survives a full re-render.
  sel.value = STATE.geo;
  if (!sel.value) {
    STATE.geo = "france";
    sel.value = "france";
  }
  return sel;
}

function buildControls(rerender: () => void): HTMLElement {
  const geoSel = buildGeoSelect(PROCESSES, rerender);

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
      STATE.geo = "france";
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
    h("label", { text: tx("geo", "Where in France") }),
    geoSel,
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
    buildAtlasPanel(currentLang),
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
    h("p", {
      class: "geo-hint",
      text: tx(
        "geoHint",
        "Four levels: all of France, a region, a department, a city. Rulings by the Conseil d'État and national instructions stay in the list wherever you look, because they bind everywhere.",
      ),
    }),
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
