/**
 * Geography for the tracker.
 *
 * One axis, four levels: country -> region -> department -> city.
 *
 * Why this is a separate file and a separate field from the old `scope`:
 * `scope` mixed two questions — "where did this happen?" and "how widely
 * does this decision bind?". A Conseil d'État ruling is decided in Paris but
 * applies in Montpellier; a prefecture's order in Toulouse does not. So:
 *
 *   geo = "national"  -> a decision that binds across all of France.
 *                         Always visible, whatever you filter to, and badged
 *                         "Applies across all of France" so the reader knows
 *                         why it stayed in the list.
 *   geo = "herault"   -> geographically in Hérault.
 *   geo = "non-attribue" -> we could not place it. Shown only under
 *                         "All of France" rather than pretending it is
 *                         national.
 */

export type GeoLevel = "country" | "region" | "dept" | "city";

export interface GeoNode {
  id: string;
  level: GeoLevel;
  parent: string | null;
  fr: string;
  en: string;
  /** Extra words that point to this place in a case title or note. */
  aliases?: string[];
  /** Small qualifier shown next to the name. */
  note?: { fr?: string; en?: string };
  /** National-level: binds across the whole country. */
  national?: boolean;
  /** Keep out of the selector. */
  hidden?: boolean;
}

function n(
  id: string,
  level: GeoLevel,
  parent: string | null,
  fr: string,
  en: string,
  extra: Partial<GeoNode> = {},
): GeoNode {
  return { id, level, parent, fr, en, ...extra };
}

export const GEO_NODES: GeoNode[] = [
  n("france", "country", null, "Toute la France", "All of France"),
  n(
    "national",
    "country",
    "france",
    "Décision nationale — applicable partout",
    "National decision — applies everywhere",
    { national: true, hidden: true },
  ),
  n(
    "non-attribue",
    "country",
    "france",
    "Non rattaché à un lieu précis",
    "Not tied to one place",
  ),

  /* ------------------------------- Occitanie ------------------------------ */
  n("occitanie", "region", "france", "Occitanie", "Occitanie"),
  n("herault", "dept", "occitanie", "Hérault", "Hérault"),
  n("montpellier", "city", "herault", "Montpellier", "Montpellier"),
  n("gard", "dept", "occitanie", "Gard", "Gard"),
  n("nimes", "city", "gard", "Nîmes", "Nîmes"),
  n("aude", "dept", "occitanie", "Aude", "Aude"),
  n("carcassonne", "city", "aude", "Carcassonne", "Carcassonne"),
  n("haute-garonne", "dept", "occitanie", "Haute-Garonne", "Haute-Garonne"),
  n("toulouse", "city", "haute-garonne", "Toulouse", "Toulouse"),
  n("tarn", "dept", "occitanie", "Tarn", "Tarn"),
  n("albi", "city", "tarn", "Albi", "Albi"),
  n("lozere", "dept", "occitanie", "Lozère", "Lozère"),
  n("mende", "city", "lozere", "Mende", "Mende"),
  n("aveyron", "dept", "occitanie", "Aveyron", "Aveyron"),
  n("rodez", "city", "aveyron", "Rodez", "Rodez"),
  n(
    "pyrenees-orientales",
    "dept",
    "occitanie",
    "Pyrénées-Orientales",
    "Pyrénées-Orientales",
  ),
  n("perpignan", "city", "pyrenees-orientales", "Perpignan", "Perpignan"),
  n(
    "tarn-et-garonne",
    "dept",
    "occitanie",
    "Tarn-et-Garonne",
    "Tarn-et-Garonne",
  ),
  n("montauban", "city", "tarn-et-garonne", "Montauban", "Montauban"),
  n("gers", "dept", "occitanie", "Gers", "Gers"),
  n("lot", "dept", "occitanie", "Lot", "Lot"),
  n("ariege", "dept", "occitanie", "Ariège", "Ariège"),
  n("foix", "city", "ariege", "Foix", "Foix"),

  /* ----------------------------- Île-de-France ---------------------------- */
  n("ile-de-france", "region", "france", "Île-de-France", "Île-de-France"),
  n("paris", "dept", "ile-de-france", "Paris", "Paris", {
    note: { fr: "ville et département", en: "city and department" },
  }),
  n("yvelines", "dept", "ile-de-france", "Yvelines", "Yvelines"),
  n("versailles", "city", "yvelines", "Versailles", "Versailles"),
  n("val-de-marne", "dept", "ile-de-france", "Val-de-Marne", "Val-de-Marne"),
  n("creteil", "city", "val-de-marne", "Créteil", "Créteil"),
  n(
    "seine-et-marne",
    "dept",
    "ile-de-france",
    "Seine-et-Marne",
    "Seine-et-Marne",
  ),
  n("melun", "city", "seine-et-marne", "Melun", "Melun"),
  n(
    "hauts-de-seine",
    "dept",
    "ile-de-france",
    "Hauts-de-Seine",
    "Hauts-de-Seine",
  ),
  n("nanterre", "city", "hauts-de-seine", "Nanterre", "Nanterre"),
  n(
    "seine-saint-denis",
    "dept",
    "ile-de-france",
    "Seine-Saint-Denis",
    "Seine-Saint-Denis",
  ),
  n("saint-denis", "city", "seine-saint-denis", "Saint-Denis", "Saint-Denis"),
  n("essonne", "dept", "ile-de-france", "Essonne", "Essonne"),
  n("evry", "city", "essonne", "Évry", "Évry"),
  n("val-d-oise", "dept", "ile-de-france", "Val-d'Oise", "Val-d'Oise"),
  n("cergy", "city", "val-d-oise", "Cergy", "Cergy"),

  /* ------------------- Provence-Alpes-Côte d'Azur ------------------------- */
  n(
    "paca",
    "region",
    "france",
    "Provence-Alpes-Côte d'Azur",
    "Provence-Alpes-Côte d'Azur",
  ),
  n("bouches-du-rhone", "dept", "paca", "Bouches-du-Rhône", "Bouches-du-Rhône"),
  n("marseille", "city", "bouches-du-rhone", "Marseille", "Marseille"),
  n("alpes-maritimes", "dept", "paca", "Alpes-Maritimes", "Alpes-Maritimes"),
  n("nice", "city", "alpes-maritimes", "Nice", "Nice"),
  n("hautes-alpes", "dept", "paca", "Hautes-Alpes", "Hautes-Alpes"),
  n("gap", "city", "hautes-alpes", "Gap", "Gap"),
  n("var", "dept", "paca", "Var", "Var"),
  n("toulon", "city", "var", "Toulon", "Toulon"),
  n("vaucluse", "dept", "paca", "Vaucluse", "Vaucluse"),
  n("avignon", "city", "vaucluse", "Avignon", "Avignon"),
  n(
    "alpes-de-haute-provence",
    "dept",
    "paca",
    "Alpes-de-Haute-Provence",
    "Alpes-de-Haute-Provence",
  ),
  n(
    "digne-les-bains",
    "city",
    "alpes-de-haute-provence",
    "Digne-les-Bains",
    "Digne-les-Bains",
  ),

  /* ---------------------------- Nouvelle-Aquitaine ------------------------- */
  n(
    "nouvelle-aquitaine",
    "region",
    "france",
    "Nouvelle-Aquitaine",
    "Nouvelle-Aquitaine",
  ),
  n("gironde", "dept", "nouvelle-aquitaine", "Gironde", "Gironde"),
  n("bordeaux", "city", "gironde", "Bordeaux", "Bordeaux"),
  n(
    "haute-vienne",
    "dept",
    "nouvelle-aquitaine",
    "Haute-Vienne",
    "Haute-Vienne",
  ),
  n("limoges", "city", "haute-vienne", "Limoges", "Limoges"),
  n(
    "charente-maritime",
    "dept",
    "nouvelle-aquitaine",
    "Charente-Maritime",
    "Charente-Maritime",
  ),
  n("la-rochelle", "city", "charente-maritime", "La Rochelle", "La Rochelle"),
  n("charente", "dept", "nouvelle-aquitaine", "Charente", "Charente"),
  n("angouleme", "city", "charente", "Angoulême", "Angoulême"),
  n("deux-sevres", "dept", "nouvelle-aquitaine", "Deux-Sèvres", "Deux-Sèvres"),
  n("niort", "city", "deux-sevres", "Niort", "Niort"),
  n(
    "pyrenees-atlantiques",
    "dept",
    "nouvelle-aquitaine",
    "Pyrénées-Atlantiques",
    "Pyrénées-Atlantiques",
  ),
  n("pau", "city", "pyrenees-atlantiques", "Pau", "Pau"),
  n("landes", "dept", "nouvelle-aquitaine", "Landes", "Landes"),
  n("mont-de-marsan", "city", "landes", "Mont-de-Marsan", "Mont-de-Marsan"),
  n("vienne", "dept", "nouvelle-aquitaine", "Vienne", "Vienne"),
  n("poitiers", "city", "vienne", "Poitiers", "Poitiers"),
  n("dordogne", "dept", "nouvelle-aquitaine", "Dordogne", "Dordogne"),
  n("perigueux", "city", "dordogne", "Périgueux", "Périgueux"),
  n(
    "lot-et-garonne",
    "dept",
    "nouvelle-aquitaine",
    "Lot-et-Garonne",
    "Lot-et-Garonne",
  ),
  n("agen", "city", "lot-et-garonne", "Agen", "Agen"),
  n("creuse", "dept", "nouvelle-aquitaine", "Creuse", "Creuse"),
  n("gueret", "city", "creuse", "Guéret", "Guéret"),

  /* -------------------------------- Bretagne ------------------------------- */
  n("bretagne", "region", "france", "Bretagne", "Bretagne"),
  n(
    "ille-et-vilaine",
    "dept",
    "bretagne",
    "Ille-et-Vilaine",
    "Ille-et-Vilaine",
  ),
  n("rennes", "city", "ille-et-vilaine", "Rennes", "Rennes"),
  n("finistere", "dept", "bretagne", "Finistère", "Finistère"),
  n("brest", "city", "finistere", "Brest", "Brest"),
  n("morbihan", "dept", "bretagne", "Morbihan", "Morbihan"),
  n("vannes", "city", "morbihan", "Vannes", "Vannes"),
  n("cotes-d-armor", "dept", "bretagne", "Côtes-d'Armor", "Côtes-d'Armor"),
  n("saint-brieuc", "city", "cotes-d-armor", "Saint-Brieuc", "Saint-Brieuc"),

  /* --------------------------- Pays de la Loire --------------------------- */
  n(
    "pays-de-la-loire",
    "region",
    "france",
    "Pays de la Loire",
    "Pays de la Loire",
  ),
  n(
    "loire-atlantique",
    "dept",
    "pays-de-la-loire",
    "Loire-Atlantique",
    "Loire-Atlantique",
  ),
  n("nantes", "city", "loire-atlantique", "Nantes", "Nantes"),
  n(
    "maine-et-loire",
    "dept",
    "pays-de-la-loire",
    "Maine-et-Loire",
    "Maine-et-Loire",
  ),
  n("angers", "city", "maine-et-loire", "Angers", "Angers"),
  n("sarthe", "dept", "pays-de-la-loire", "Sarthe", "Sarthe"),
  n("le-mans", "city", "sarthe", "Le Mans", "Le Mans"),
  n("vendee", "dept", "pays-de-la-loire", "Vendée", "Vendée"),
  n(
    "la-roche-sur-yon",
    "city",
    "vendee",
    "La Roche-sur-Yon",
    "La Roche-sur-Yon",
  ),
  n("mayenne", "dept", "pays-de-la-loire", "Mayenne", "Mayenne"),
  n("laval", "city", "mayenne", "Laval", "Laval"),

  /* ------------------------- Auvergne-Rhône-Alpes ------------------------- */
  n(
    "auvergne-rhone-alpes",
    "region",
    "france",
    "Auvergne-Rhône-Alpes",
    "Auvergne-Rhône-Alpes",
  ),
  n("rhone", "dept", "auvergne-rhone-alpes", "Rhône", "Rhône"),
  n("lyon", "city", "rhone", "Lyon", "Lyon"),
  n("isere", "dept", "auvergne-rhone-alpes", "Isère", "Isère"),
  n("grenoble", "city", "isere", "Grenoble", "Grenoble"),
  n(
    "haute-savoie",
    "dept",
    "auvergne-rhone-alpes",
    "Haute-Savoie",
    "Haute-Savoie",
  ),
  n("annecy", "city", "haute-savoie", "Annecy", "Annecy"),
  n("loire", "dept", "auvergne-rhone-alpes", "Loire", "Loire"),
  n("saint-etienne", "city", "loire", "Saint-Étienne", "Saint-Étienne"),
  n(
    "puy-de-dome",
    "dept",
    "auvergne-rhone-alpes",
    "Puy-de-Dôme",
    "Puy-de-Dôme",
  ),
  n(
    "clermont-ferrand",
    "city",
    "puy-de-dome",
    "Clermont-Ferrand",
    "Clermont-Ferrand",
  ),
  n("savoie", "dept", "auvergne-rhone-alpes", "Savoie", "Savoie"),
  n("chambery", "city", "savoie", "Chambéry", "Chambéry"),
  n(
    "haute-loire",
    "dept",
    "auvergne-rhone-alpes",
    "Haute-Loire",
    "Haute-Loire",
  ),
  n(
    "le-puy-en-velay",
    "city",
    "haute-loire",
    "Le Puy-en-Velay",
    "Le Puy-en-Velay",
  ),
  n("ain", "dept", "auvergne-rhone-alpes", "Ain", "Ain"),
  n("bourg-en-bresse", "city", "ain", "Bourg-en-Bresse", "Bourg-en-Bresse"),
  n("ardeche", "dept", "auvergne-rhone-alpes", "Ardèche", "Ardèche"),
  n("privas", "city", "ardeche", "Privas", "Privas"),
  n("drome", "dept", "auvergne-rhone-alpes", "Drôme", "Drôme"),
  n("valence", "city", "drome", "Valence", "Valence"),

  /* ------- Other regions: in the tree so future rows find a home ------------ */
  n(
    "centre-val-de-loire",
    "region",
    "france",
    "Centre-Val de Loire",
    "Centre-Val de Loire",
  ),
  n("corse", "region", "france", "Corse", "Corsica"),
  n(
    "bourgogne-franche-comte",
    "region",
    "france",
    "Bourgogne-Franche-Comté",
    "Bourgogne-Franche-Comté",
  ),
  n("grand-est", "region", "france", "Grand Est", "Grand Est"),
  n(
    "hauts-de-france",
    "region",
    "france",
    "Hauts-de-France",
    "Hauts-de-France",
  ),
  n("normandie", "region", "france", "Normandie", "Normandy"),
  n("reunion", "region", "france", "La Réunion", "La Réunion"),
  n("guadeloupe", "region", "france", "Guadeloupe", "Guadeloupe"),
  n("martinique", "region", "france", "Martinique", "Martinique"),
  n("guyane", "region", "france", "Guyane", "French Guiana"),
  n("mayotte", "region", "france", "Mayotte", "Mayotte"),
];

export const GEO_BY_ID = new Map(GEO_NODES.map((x) => [x.id, x]));

export function geoNode(id: string): GeoNode | undefined {
  return GEO_BY_ID.get(id);
}

export function childrenOf(parentId: string): GeoNode[] {
  return GEO_NODES.filter((x) => x.parent === parentId);
}

/** Every node below `id`, `id` included. */
const DESC_CACHE = new Map<string, Set<string>>();
export function descendants(id: string): Set<string> {
  const hit = DESC_CACHE.get(id);
  if (hit) return hit;
  const out = new Set<string>([id]);
  for (const child of childrenOf(id))
    for (const d of descendants(child.id)) out.add(d);
  DESC_CACHE.set(id, out);
  return out;
}

/** Ancestors of `id`, nearest first, up to and including "france". */
export function ancestorsOf(id: string): GeoNode[] {
  const out: GeoNode[] = [];
  let cur = GEO_BY_ID.get(id);
  while (cur && cur.parent) {
    const p = GEO_BY_ID.get(cur.parent);
    if (!p) break;
    out.push(p);
    cur = p;
  }
  return out;
}

/* ------------------------------------------------------------------ labels */

export type Lang = "en" | "fr";

export function geoLabel(id: string, lang: Lang): string {
  const node = GEO_BY_ID.get(id);
  if (!node) return id;
  const base = lang === "fr" ? node.fr : node.en;
  const note = node.note?.[lang];
  return note ? `${base} (${note})` : base;
}

export function geoLevelLabel(level: GeoLevel, lang: Lang): string {
  const en: Record<GeoLevel, string> = {
    country: "country",
    region: "region",
    dept: "department",
    city: "city",
  };
  const fr: Record<GeoLevel, string> = {
    country: "pays",
    region: "région",
    dept: "département",
    city: "ville",
  };
  return lang === "fr" ? fr[level] : en[level];
}

/** "France › Occitanie › Hérault › Montpellier" */
export function geoPath(id: string, lang: Lang): string {
  if (!id || id === "france") return geoLabel("france", lang);
  const parts = [geoLabel(id, lang)];
  for (const a of ancestorsOf(id)) parts.unshift(geoLabel(a.id, lang));
  return parts.join(" › ");
}

/* --------------------------------------------------------------- matching */

const LEVEL_RANK: Record<GeoLevel, number> = {
  country: 0,
  region: 1,
  dept: 2,
  city: 3,
};

function strip(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’]/g, "'");
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function aliasesOf(node: GeoNode): string[] {
  const raw = [node.fr, node.en, ...(node.aliases ?? [])];
  return [...new Set(raw.filter(Boolean))];
}

/**
 * Find the place named in a piece of text.
 * The most specific match wins (a city beats a department beats a region).
 * Names of four letters or fewer must appear capitalised, so that "Gap" or
 * "Nice" in an English sentence are not mistaken for place names.
 */
function findNodeIn(text: string): GeoNode | undefined {
  if (!text) return undefined;
  const flat = strip(text);
  const hits: { node: GeoNode; rank: number; len: number }[] = [];

  for (const node of GEO_NODES) {
    if (node.hidden) continue;
    if (node.level === "country") continue;
    for (const alias of aliasesOf(node)) {
      const a = strip(alias);
      if (a.length < 3) continue;
      let found = false;
      if (a.length <= 4) {
        const re = new RegExp(
          `\\b${escapeRe(alias.replace(/[’]/g, "['’]"))}\\b`,
        );
        found = re.test(text);
      } else {
        const re = new RegExp(`\\b${escapeRe(a)}\\b`, "i");
        found = re.test(flat);
      }
      if (found) {
        hits.push({ node, rank: LEVEL_RANK[node.level], len: a.length });
        break;
      }
    }
  }
  if (!hits.length) return undefined;
  hits.sort((a, b) => b.rank - a.rank || b.len - a.len);
  return hits[0].node;
}

/* ------------------------------------------------------------- case shape */

export interface GeoCaseLike {
  id?: string;
  /** optional explicit placement, set on the row itself */
  geo?: string;
  /** the tracker's old flat scope field */
  scope?: string;
  title?: string;
  note?: string;
  place?: string;
  city?: string;
  location?: string;
  dept?: string;
  region?: string;
  forum?: string;
  [k: string]: unknown;
}

/**
 * Explicit placement, case by case.
 * This is the table to edit when the automatic text match guesses wrong, or
 * when a case has no place named in its title at all.
 */
export const GEO_BY_CASE: Record<string, string> = {
  /* Decisions that bind across the whole country. */
  "ce-520729": "national", // Conseil d'État
  "pen-darmanin-circulaire": "national", // ministerial circular
  "ind-national": "national", // national compensation framework
  ppe: "national", // national framework for protective-equipment bans

  /* Paris */
  "paris-1011": "paris",
  "paris-2410": "paris",
  "pen-paris-ci": "paris",
  "pen-paris-crpc": "paris",
  "pen-paris-nonsaisi": "paris",

  /* Elsewhere */
  "pen-nantes-mesure": "nantes",
  "pen-brest-enquete": "brest",
  "pen-brest-photos": "brest",
  "yvelines-2910": "yvelines",

  /* Place not established in the source — fill these in if you can. */
  "pen-17": "non-attribue",
  "pen-09": "non-attribue",
  "pen-24": "non-attribue",
};

const LEGACY_SCOPE: Record<string, string> = {
  herault: "herault",
  occitanie: "occitanie",
  national: "non-attribue",
};

function textOf(p: GeoCaseLike): string {
  return [p.title, p.place, p.city, p.location, p.dept, p.region, p.note]
    .filter((x): x is string => typeof x === "string" && x.length > 0)
    .join(" ");
}

/** Where a case belongs, as one of the geo ids. */
export function geoFor(p: GeoCaseLike): string {
  if (p.geo && GEO_BY_ID.has(p.geo)) return p.geo;

  const id = p.id;
  if (id && GEO_BY_CASE[id]) return GEO_BY_CASE[id];

  const found = findNodeIn(textOf(p));
  if (found) return found.id;

  const scope = String(p.scope ?? "")
    .toLowerCase()
    .trim();
  if (LEGACY_SCOPE[scope]) return LEGACY_SCOPE[scope];

  return "non-attribue";
}

/** True for decisions that apply across all of France. */
export function isNationalCase(p: GeoCaseLike): boolean {
  return geoFor(p) === "national";
}

/**
 * Does this case belong in the list the reader has asked for?
 *  - "france" (All of France) shows everything
 *  - national decisions always show: they bind wherever you look
 *  - otherwise the place must sit inside the chosen area
 */
export function matchesGeo(p: GeoCaseLike, selected: string): boolean {
  if (!selected || selected === "france") return true;
  const g = geoFor(p);
  if (g === "national") return true;
  if (selected === "non-attribue") return g === "non-attribue";
  return descendants(selected).has(g);
}

/* ----------------------------------------------------------------- options */

export interface GeoOption {
  id: string;
  label: string;
  level: GeoLevel;
  /** how many rows the reader will see if they pick this */
  count: number;
  /** 0 = region, 1 = department, 2 = city */
  depth: number;
  regionId: string;
  parentId: string | null;
}

/**
 * Build the selector's option list from the data.
 * Only places that actually have cases appear.
 */
export function geoOptions(cases: GeoCaseLike[], lang: Lang): GeoOption[] {
  const countFor = (id: string) =>
    cases.filter((c) => matchesGeo(c, id)).length;
  const out: GeoOption[] = [];

  const regions = GEO_NODES.filter((x) => x.level === "region");
  for (const region of regions) {
    const rc = countFor(region.id);
    if (!rc) continue;
    out.push({
      id: region.id,
      label: geoLabel(region.id, lang),
      level: "region",
      count: rc,
      depth: 0,
      regionId: region.id,
      parentId: "france",
    });

    for (const dept of childrenOf(region.id).filter(
      (x) => x.level === "dept",
    )) {
      const dc = countFor(dept.id);
      if (!dc) continue;
      out.push({
        id: dept.id,
        label: geoLabel(dept.id, lang),
        level: "dept",
        count: dc,
        depth: 1,
        regionId: region.id,
        parentId: region.id,
      });

      for (const city of childrenOf(dept.id).filter(
        (x) => x.level === "city",
      )) {
        const cc = countFor(city.id);
        if (!cc) continue;
        out.push({
          id: city.id,
          label: geoLabel(city.id, lang),
          level: "city",
          count: cc,
          depth: 2,
          regionId: region.id,
          parentId: dept.id,
        });
      }
    }
  }
  return out;
}

/**
 * Rows we could not place, so the editor can fill in GEO_BY_CASE.
 * Run it in the browser console: console.table(geoAudit(CASES))
 */
export function geoAudit(cases: GeoCaseLike[]): {
  id: string;
  title: string;
  scope: string;
  guessed: string;
}[] {
  return cases
    .filter((c) => geoFor(c) === "non-attribue")
    .map((c) => ({
      id: c.id ?? "",
      title: c.title ?? "",
      scope: c.scope ?? "",
      guessed: "non-attribue",
    }));
}
