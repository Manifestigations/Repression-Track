export type Tier = "admin" | "penal" | "indemn";

export type Scope = "herault" | "occitanie" | "national";

export type Stage =
  | "ban"
  | "refere"
  | "fond"
  | "controle"
  | "interpellation"
  | "enquete"
  | "poursuite"
  | "audience"
  | "condamnation"
  | "appel"
  | "mesure"
  | "indemnite"
  | "parlementaire"
  | "circulaire";

export type Verdict =
  | "annule"
  | "suspendu"
  | "rejete"
  | "accueil"
  | "confirme"
  | "retire"
  | "indetermine"
  | "en-cours";

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
  jurisdiction: string;
  city?: string;
  dept?: string;
  scope: "herault" | "occitanie" | "national";
  /** precise placement — id from src/client/geo.ts */
  geo?: string;
  tier: "admin" | "penal" | "indemn";
  stage: string;
  status: string;
  verdict: string;
  order?: string;
  opened: string;
  resolved?: string;
  deadlines: Deadline[];
  note?: string;
  holding?: string;
  unverified?: boolean;
  sourceKeys: string[];
}

export interface Reference {
  ref: string;
  date: string;
  forum: string;
  holding: string;
  weight: "cadre" | "herault" | "national" | "non-ouvert";
}

export interface Trigger {
  date: string;
  label: string;
  kind: "audience" | "echeance" | "manifestation";
  confidence: Confidence;
}

/** As-of date driving every countdown in the UI. */
export const TODAY = "2026-11-13";

export function daysUntil(iso: string, today: string = TODAY): number {
  return Math.round(
    (Date.parse(`${iso}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) /
      86_400_000,
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
  herault: number;
  occitanie: number;
  national: number;
  arrests: number;
  trials: number;
  bans: number;
}

export function stats(list: Process[]): Stats {
  const s: Stats = {
    total: list.length,
    admin: 0,
    penal: 0,
    open: 0,
    critical: 0,
    unverified: 0,
    decided: 0,
    herault: 0,
    occitanie: 0,
    national: 0,
    arrests: 0,
    trials: 0,
    bans: 0,
  };
  for (const p of list) {
    if (p.tier === "admin") s.admin++;
    if (p.tier === "penal") s.penal++;
    if (p.status === "encours" || p.status === "averifier") s.open++;
    if (p.status === "rejet" || p.status === "accueil" || p.status === "clos")
      s.decided++;
    if (p.unverified) s.unverified++;
    if (p.scope === "herault") s.herault++;
    if (p.scope === "occitanie") s.occitanie++;
    if (p.scope === "national") s.national++;
    if (p.stage === "interpellation") s.arrests++;
    if (p.stage === "audience" || p.stage === "condamnation") s.trials++;
    if (p.stage === "ban") s.bans++;
    const n = nextDeadline(p);
    if (n && daysUntil(n.date) <= 7) s.critical++;
  }
  return s;
}

export function statusClass(s: Status): string {
  return `pill st-${s}`;
}

export function verdictClass(v: Verdict | undefined): string {
  return `pill vd-${v ?? "indetermine"}`;
}
