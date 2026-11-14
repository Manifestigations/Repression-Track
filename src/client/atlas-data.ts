/**
 * DUMMY DATA — replace wholesale.
 * X  = choropleth value (per department)
 * Y/Z/A = bar series per cluster (nullable: a place may ship 1, 2 or 3)
 * inProgress/resolved = process totals shown under each cluster
 */
export type AtlasLevel = "region" | "dept" | "city";

export interface AtlasRow {
  id: string; // geo id (matches geo.ts)
  level: AtlasLevel;
  code?: string; // INSEE code, for GeoJSON matching
  fr: string;
  en: string;
  x?: number | null; // dataset X (choropleth)
  inProgress?: number | null;
  resolved?: number | null;
  y?: number | null;
  z?: number | null;
  a?: number | null;
  /** [lat, lng] of the administrative centre */
  at?: [number, number];
  /** draw a bar cluster here */
  cluster?: boolean;
  /** px nudge when two clusters share an anchor (dept + its préfecture city) */
  offset?: [number, number];
}

export const SERIES = [
  { key: "Y", colour: "#4f8cff" },
  { key: "Z", colour: "#3ddc97" },
  { key: "A", colour: "#ffd166" },
] as const;

export const ATLAS: AtlasRow[] = [
  {
    id: "occitanie",
    level: "region",
    code: "76",
    fr: "Occitanie",
    en: "Occitanie",
    x: 118,
    inProgress: 21,
    resolved: 14,
    y: 21,
    z: 14,
    a: 9,
    at: [43.6045, 1.4442],
    cluster: true, // Toulouse, chef-lieu
  },
  {
    id: "herault",
    level: "dept",
    code: "34",
    fr: "Hérault",
    en: "Hérault",
    x: 34,
    inProgress: 12,
    resolved: 7,
    y: 12,
    z: 7,
    a: 5,
    at: [43.6108, 3.8767],
    cluster: true,
    offset: [-74, 0],
  },
  {
    id: "hautes-pyrenees",
    level: "dept",
    code: "65",
    fr: "Hautes-Pyrénées",
    en: "Hautes-Pyrénées",
    x: 9,
  },
  {
    id: "montpellier",
    level: "city",
    code: "34172",
    fr: "Montpellier",
    en: "Montpellier",
    x: 24,
    inProgress: 9,
    resolved: 4,
    y: 9,
    z: 4,
    a: null, // <- A absent on purpose
    at: [43.6108, 3.8767],
    cluster: true,
    offset: [74, 0],
  },

  // rest of Occitanie: choropleth only (cluster: false)
  { id: "ariege", level: "dept", code: "09", fr: "Ariège", en: "Ariège", x: 6 },
  { id: "aude", level: "dept", code: "11", fr: "Aude", en: "Aude", x: 14 },
  {
    id: "aveyron",
    level: "dept",
    code: "12",
    fr: "Aveyron",
    en: "Aveyron",
    x: 5,
  },
  { id: "gard", level: "dept", code: "30", fr: "Gard", en: "Gard", x: 22 },
  {
    id: "haute-garonne",
    level: "dept",
    code: "31",
    fr: "Haute-Garonne",
    en: "Haute-Garonne",
    x: 41,
  },
  { id: "gers", level: "dept", code: "32", fr: "Gers", en: "Gers", x: 3 },
  { id: "lot", level: "dept", code: "46", fr: "Lot", en: "Lot", x: 4 },
  {
    id: "lozere",
    level: "dept",
    code: "48",
    fr: "Lozère",
    en: "Lozère",
    x: null,
  },
  {
    id: "pyrenees-orientales",
    level: "dept",
    code: "66",
    fr: "Pyrénées-Orientales",
    en: "Pyrénées-Orientales",
    x: 17,
  },
  { id: "tarn", level: "dept", code: "81", fr: "Tarn", en: "Tarn", x: 11 },
  {
    id: "tarn-et-garonne",
    level: "dept",
    code: "82",
    fr: "Tarn-et-Garonne",
    en: "Tarn-et-Garonne",
    x: 8,
  },
];

export const ATLAS_ROW = new Map(ATLAS.map((r) => [r.id, r]));

/** "9" | "09" | "009" -> "09" */
export function normCode(code: unknown): string {
  const raw = String(code ?? "")
    .trim()
    .toUpperCase();
  if (!/^\d+$/.test(raw)) return raw;
  return raw.length === 1 ? `0${raw}` : raw;
}
