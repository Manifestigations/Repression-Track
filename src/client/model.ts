export type Tier = "admin" | "penal" | "indemn";

export type Status =
  | "rejet"
  | "accueil"
  | "encours"
  | "averifier"
  | "clos"
  | "sansobjet";

export type Confidence = "ferme" | "estime" | "inconnu";

export type Urgency = "crit" | "warn" | "info" | "past";

export interface Deadline {
  label: string;
  date: string;
  basis: string;
  confidence: Confidence;
  closed?: boolean;
}

export interface Process {
  id: string;
  ref: string;
  title: string;
  forum: string;
  tier: Tier;
  status: Status;
  order?: string;
  opened: string;
  resolved?: string;
  deadlines: Deadline[];
  note: string;
  holding?: string;
  unverified?: boolean;
  sourceKeys?: string[];
}

export interface Reference {
  ref: string;
  date: string;
  forum: string;
  holding: string;
  weight: "cadre" | "herault" | "non-ouvert";
}

export interface Trigger {
  date: string;
  label: string;
  kind: "audience" | "echeance" | "manifestation";
  confidence: Confidence;
}

/** As-of date driving every countdown in the UI. */
export const TODAY = "2026-11-12";

export function daysUntil(iso: string, today: string = TODAY): number {
  return Math.round(
    (Date.parse(`${iso}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / 86_400_000,
  );
}

export function urgencyOf(days: number): Urgency {
  if (days < 0) return "past";
  if (days <= 7) return "crit";
  if (days <= 21) return "warn";
  return "info";
}

export function openDeadlines(p: Process): Deadline[] {
  return p.deadlines
    .filter((d) => !d.closed && daysUntil(d.date) >= 0)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function nextDeadline(p: Process): Deadline | null {
  return openDeadlines(p)[0] ?? null;
}

export function rankOf(p: Process): number {
  const n = nextDeadline(p);
  if (!n) return Number.MAX_SAFE_INTEGER;
  return daysUntil(n.date);
}

export function sortByUrgency(list: Process[]): Process[] {
  return [...list].sort((a, b) => {
    const ra = rankOf(a);
    const rb = rankOf(b);
    if (ra !== rb) return ra - rb;
    return (b.resolved ?? b.opened).localeCompare(a.resolved ?? a.opened);
  });
}

export interface Stats {
  total: number;
  admin: number;
  penal: number;
  open: number;
  critical: number;
  unverified: number;
  decided: number;
}

export function stats(list: Process[]): Stats {
  let admin = 0;
  let penal = 0;
  let open = 0;
  let critical = 0;
  let unverified = 0;
  let decided = 0;
  for (const p of list) {
    if (p.tier === "admin") admin++;
    if (p.tier === "penal") penal++;
    if (p.status === "encours" || p.status === "averifier") open++;
    if (p.status === "rejet" || p.status === "accueil" || p.status === "clos") decided++;
    if (p.unverified) unverified++;
    const n = nextDeadline(p);
    if (n && daysUntil(n.date) <= 7) critical++;
  }
  return { total: list.length, admin, penal, open, critical, unverified, decided };
}

export function statusClass(s: Status): string {
  return `pill st-${s}`;
}
