import { mount, makeTodayLine } from "./canvas.ts";
import { daysUntil, nextDeadline, urgencyOf } from "./model.ts";
import type { Process, Scope } from "./model.ts";
import { DAY, utc } from "./dom.ts";

const EPOCH = "2026-10-01";
const HORIZON = "2027-02-01";

const TIER_COLOR: Record<string, string> = {
  admin: "#4f8cff",
  penal: "#ff6b6b",
  indemn: "#ffd166",
};

const SCOPE_COLOR: Record<Scope, string> = {
  herault: "#4f8cff",
  occitanie: "#7c5cff",
  national: "#3ddc97",
};

const STATUS_COLOR: Record<string, string> = {
  rejet: "#ff6b6b",
  accueil: "#3ddc97",
  encours: "#4f8cff",
  averifier: "#ffd166",
  clos: "#8b93a7",
  sansobjet: "#5b6478",
};

const URGENCY_COLOR: Record<string, string> = {
  crit: "#ff6b6b",
  warn: "#ffd166",
  info: "#4f8cff",
  past: "#5b6478",
};

function dayIndex(iso: string): number {
  return Math.round((utc(iso) - utc(EPOCH)) / DAY);
}

function isoFromIndex(i: number): string {
  return new Date(utc(EPOCH) + i * DAY).toISOString().slice(0, 10);
}

function shortDate(iso: string): string {
  return `${iso.slice(8, 10)}/${iso.slice(5, 7)}`;
}

export function renderTimeline(
  rows: Process[],
  labels: Record<string, string>,
): void {
  const list = rows.filter((p) => p.opened <= HORIZON);
  const names = list.map((p) => p.ref);
  const today = dayIndex("2026-11-13");

  const spans = list.map((p) => {
    const start = dayIndex(p.opened);
    const end = Math.max(dayIndex(p.resolved ?? "2026-11-13"), start + 1);
    return [start, end];
  });

  const marks = list.map((p) => {
    const n = nextDeadline(p);
    if (!n) return null;
    const i = dayIndex(n.date);
    return [i - 0.35, i + 0.35];
  });

  mount("timeline", {
    type: "bar",
    data: {
      labels: names,
      datasets: [
        {
          label: "span",
          data: spans as never,
          backgroundColor: list.map((p) => TIER_COLOR[p.tier] ?? "#4f8cff"),
          borderRadius: 3,
          barPercentage: 0.55,
          categoryPercentage: 0.8,
        },
        {
          label: "deadline",
          data: marks as never,
          backgroundColor: "#ff6b6b",
          borderRadius: 1,
          barPercentage: 0.9,
          categoryPercentage: 0.8,
        },
      ],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const p = list[ctx.dataIndex];
              if (!p) return "";
              const raw = ctx.raw as [number, number];
              const a = isoFromIndex(Math.round(raw[0]));
              const b = isoFromIndex(Math.round(raw[1]));
              return ctx.datasetIndex === 0
                ? `${p.ref} · ${p.status} · ${a} → ${b}`
                : `${labels.colNext}: ${b}`;
            },
          },
        },
      },
      scales: {
        x: {
          min: dayIndex(EPOCH),
          max: dayIndex(HORIZON),
          grid: { color: "#1a2130" },
          ticks: {
            maxTicksLimit: 14,
            callback: (v) => shortDate(isoFromIndex(Number(v))),
          },
        },
        y: {
          grid: { display: false },
          ticks: { font: { size: 9.5 }, autoSkip: false },
        },
      },
    },
    plugins: [makeTodayLine(today)],
  });
}

export function renderDeadlines(
  rows: Process[],
  labels: Record<string, string>,
): void {
  const items: { text: string; days: number }[] = [];
  for (const p of rows) {
    for (const d of p.deadlines) {
      if (d.closed) continue;
      const days = daysUntil(d.date);
      if (days < 0) continue;
      items.push({ text: `${p.ref} — ${d.label}`, days });
    }
  }
  items.sort((a, b) => a.days - b.days);
  const top = items.slice(0, 14);

  mount("deadlines", {
    type: "bar",
    data: {
      labels: top.map((i) => i.text),
      datasets: [
        {
          label: labels.day,
          data: top.map((i) => i.days),
          backgroundColor: top.map((i) => URGENCY_COLOR[urgencyOf(i.days)]),
          borderRadius: 3,
          barPercentage: 0.7,
        },
      ],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.raw} ${labels.day}`,
          },
        },
      },
      scales: {
        x: {
          grid: { color: "#1a2130" },
          title: { display: true, text: labels.day, color: "#5b6478" },
          ticks: { precision: 0 },
        },
        y: {
          grid: { display: false },
          ticks: { font: { size: 9.5 }, autoSkip: false },
        },
      },
    },
  });
}

export function renderStatusMix(
  rows: Process[],
  labels: Record<string, string>,
): void {
  const counts = new Map<string, number>();
  for (const p of rows) counts.set(p.status, (counts.get(p.status) ?? 0) + 1);
  const keys = [...counts.keys()].sort();

  mount("statusMix", {
    type: "doughnut",
    data: {
      labels: keys.map((k) => labels[k] ?? k),
      datasets: [
        {
          data: keys.map((k) => counts.get(k) ?? 0),
          backgroundColor: keys.map((k) => STATUS_COLOR[k] ?? "#5b6478"),
          borderColor: "#121722",
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "62%",
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            boxWidth: 9,
            boxHeight: 9,
            padding: 10,
            font: { size: 10.5 },
          },
        },
      },
    },
  });
}

/** Administrative files by city, coloured by territorial scope. */
export function renderCoverage(
  rows: Process[],
  labels: Record<string, string>,
): void {
  const byCity = new Map<string, { n: number; scope: Scope }>();
  for (const p of rows) {
    if (p.tier !== "admin" || !p.city) continue;
    const cur = byCity.get(p.city);
    if (cur) cur.n++;
    else byCity.set(p.city, { n: 1, scope: p.scope });
  }
  const entries = [...byCity.entries()]
    .sort((a, b) => b[1].n - a[1].n)
    .slice(0, 16);

  mount("coverage", {
    type: "bar",
    data: {
      labels: entries.map((e) => e[0]),
      datasets: [
        {
          label: labels.colProcess,
          data: entries.map((e) => e[1].n),
          backgroundColor: entries.map((e) => SCOPE_COLOR[e[1].scope]),
          borderRadius: 3,
          barPercentage: 0.72,
        },
      ],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const e = entries[ctx.dataIndex];
              if (!e) return "";
              return `${ctx.raw} · ${labels[e[1].scope] ?? e[1].scope}`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: { color: "#1a2130" },
          ticks: { precision: 0 },
        },
        y: {
          grid: { display: false },
          ticks: { font: { size: 10 } },
        },
      },
    },
  });
}
