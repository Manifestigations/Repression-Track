import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Chart, Plugin } from "chart.js";
import { destroyMounted, mount } from "./canvas.ts";
import { ATLAS, SERIES, normCode, type AtlasRow } from "./atlas-data.ts";
import { h } from "./dom.ts";
import type { Lang } from "./i18n.ts";

/* ------------------------------------------------------------------ strings */
const S = {
  fr: {
    title: "Atlas territorial",
    sub: "X = volume par département · Y, Z, A = procédures par centre administratif",
    dummy: "données factices",
    noData: "aucune donnée",
    missing: "absent",
    open: "en cours",
    closed: "clos",
    xLegend: "X (choroplèthe)",
    none: "aucun chiffre pour ce lieu",
    gaps: "Valeurs manquantes",
    noGaps: "Toutes les séries sont renseignées.",
    source: "Contours : france-geojson (IGN) · fonds : OpenStreetMap / CARTO",
    offline:
      "Contours indisponibles (hors ligne) — barres affichées sans fond cartographique.",
  },
  en: {
    title: "Territorial atlas",
    sub: "X = volume per department · Y, Z, A = processes per administrative centre",
    dummy: "dummy data",
    noData: "no data",
    missing: "missing",
    open: "in progress",
    closed: "resolved",
    xLegend: "X (choropleth)",
    none: "no figures for this place",
    gaps: "Missing values",
    noGaps: "All series present.",
    source: "Boundaries: france-geojson (IGN) · basemap: OpenStreetMap / CARTO",
    offline: "Boundaries unavailable (offline) — bars shown without a basemap.",
  },
} as const;

/* --------------------------------------------------------------- geometry */
const OCCITANIE_CODES = new Set(
  ATLAS.filter((r) => r.level === "dept").map((r) => normCode(r.code)),
);

/** Fallback view if the GeoJSON never arrives (real Occitanie extent). */
const OCCITANIE_BOUNDS = L.latLngBounds([42.33, -0.4], [45.05, 4.85]);
const OCCITANIE_CENTER: L.LatLngExpression = [43.6, 3.0];
const OCCITANIE_ZOOM = 7;

const GEO = {
  depts: [
    "https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/regions/occitanie/departements-occitanie.geojson",
    "https://cdn.jsdelivr.net/gh/gregoiredavid/france-geojson@master/regions/occitanie/departements-occitanie.geojson",
    "https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/departements-version-simplifiee.geojson",
  ],
  communes: [
    "https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/departements/34-herault/communes-34-herault.geojson",
    "https://cdn.jsdelivr.net/gh/gregoiredavid/france-geojson@master/departements/34-herault/communes-34-herault.geojson",
  ],
} as const;

type Collection = GeoJSON.FeatureCollection;

async function firstJson(urls: readonly string[]): Promise<Collection | null> {
  for (const url of urls) {
    try {
      const res = await fetch(url, { cache: "force-cache" });
      if (!res.ok) {
        console.warn(`[atlas] HTTP ${res.status} — ${url}`);
        continue;
      }
      const json = (await res.json()) as Collection | null;
      if (
        json?.type !== "FeatureCollection" ||
        !Array.isArray(json.features) ||
        !json.features.length
      ) {
        console.warn(`[atlas] not a FeatureCollection — ${url}`);
        continue;
      }
      return json;
    } catch (err) {
      console.warn(`[atlas] fetch failed — ${url}`, err);
    }
  }
  return null;
}

function featureCode(f: GeoJSON.Feature): string {
  const p = (f.properties ?? {}) as Record<string, unknown>;
  return normCode(
    p.code ??
      p.CODE_DEPT ??
      p.insee ??
      (f.id as string | number | undefined) ??
      "",
  );
}

function featureName(f: GeoJSON.Feature): string {
  const p = (f.properties ?? {}) as Record<string, unknown>;
  return String(p.nom ?? p.name ?? featureCode(f));
}

/* ------------------------------------------------------------------ colours */
const RAMP: Array<[number, [number, number, number]]> = [
  [0, [23, 32, 51]],
  [0.35, [38, 78, 140]],
  [0.7, [79, 140, 255]],
  [1, [61, 220, 151]],
];

function ramp(t: number): string {
  const v = Math.min(1, Math.max(0, t));
  for (let i = 1; i < RAMP.length; i++) {
    const [p1, c1] = RAMP[i]!;
    const [p0, c0] = RAMP[i - 1]!;
    if (v <= p1) {
      const k = (v - p0) / (p1 - p0 || 1);
      const c = c0.map((n, j) => Math.round(n + (c1[j]! - n) * k));
      return `rgb(${c[0]},${c[1]},${c[2]})`;
    }
  }
  return "rgb(61,220,151)";
}

function shade(hex: string, amount: number): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex);
  if (!m) return hex;
  const n = parseInt(m[1]!, 16);
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) =>
    amount >= 0
      ? Math.round(c + (255 - c) * amount)
      : Math.round(c * (1 + amount)),
  );
  return `rgb(${ch[0]},${ch[1]},${ch[2]})`;
}

/* ------------------------------------------------- isometric bar plugin (2.5D) */
interface BarGeom {
  x: number;
  y: number;
  base: number;
  width: number;
  skip?: boolean;
}

const isoBars: Plugin = {
  id: "atlasIsoBars",
  beforeDatasetDraw(chart: Chart, args) {
    const meta = chart.getDatasetMeta(args.index);
    if (meta.hidden) return false;
    const ds = chart.data.datasets[args.index];
    const colour =
      typeof ds?.backgroundColor === "string" ? ds.backgroundColor : "#4f8cff";
    const ctx = chart.ctx;
    const area = chart.chartArea;
    const depth = Math.max(5, Math.min(11, (area.bottom - area.top) * 0.13));
    const dx = depth * 0.6;
    const dy = depth * 0.9;

    for (const el of meta.data) {
      const b = el as unknown as BarGeom;
      if (b.skip || !Number.isFinite(b.y) || !Number.isFinite(b.base)) continue;
      const hgt = b.base - b.y;
      if (hgt <= 0.5 || !b.width) continue;
      const x0 = b.x - b.width / 2;
      const x1 = b.x + b.width / 2;

      ctx.save();
      ctx.fillStyle = "rgba(0,0,0,0.38)";
      ctx.beginPath();
      ctx.ellipse(
        b.x + dx * 0.5,
        b.base + 1,
        b.width * 0.72,
        b.width * 0.28,
        0,
        0,
        Math.PI * 2,
      );
      ctx.fill();

      ctx.fillStyle = shade(colour, -0.42);
      ctx.beginPath();
      ctx.moveTo(x1, b.y);
      ctx.lineTo(x1 + dx, b.y - dy);
      ctx.lineTo(x1 + dx, b.base - dy);
      ctx.lineTo(x1, b.base);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = shade(colour, 0.34);
      ctx.beginPath();
      ctx.moveTo(x0, b.y);
      ctx.lineTo(x0 + dx, b.y - dy);
      ctx.lineTo(x1 + dx, b.y - dy);
      ctx.lineTo(x1, b.y);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = colour;
      ctx.fillRect(x0, b.y, b.width, hgt);
      ctx.restore();
    }
    return false;
  },
};

/* ---------------------------------------------------------------- lifecycle */
interface Cluster {
  el: HTMLElement;
  latlng: L.LatLngExpression;
  offset: [number, number];
  id: string;
}

interface Live {
  map: L.Map | null;
  layer: L.GeoJSON | null;
  clusters: Cluster[];
  stopWaiting?: () => void;
  ro?: ResizeObserver;
  place?: () => void;
  /** real box known + view set: pixel projection is safe */
  ready: boolean;
  /** panel torn down: observers / async continuations must no-op */
  dead: boolean;
}

function freshLive(): Live {
  return { map: null, layer: null, clusters: [], ready: false, dead: false };
}

let live: Live = freshLive();

function teardown(): void {
  live.dead = true;
  live.stopWaiting?.();
  destroyMounted("atlasbar-");
  live.ro?.disconnect();
  try {
    live.map?.remove();
  } catch {
    /* already detached */
  }
  live = freshLive();
}

/**
 * Wait until `el` is in the document AND actually laid out. Leaflet cannot be
 * constructed before this: a 0x0 container projects every latlng to the same
 * pixel and never fetches a tile. No attempt limit — the panel may be rendered
 * detached and appended later, or inside a hidden tab.
 */
function onLaidOut(el: HTMLElement, cb: () => void): () => void {
  let done = false;
  let raf = 0;
  let ro: ResizeObserver | null = null;

  const stop = (): void => {
    done = true;
    ro?.disconnect();
    ro = null;
    cancelAnimationFrame(raf);
  };

  const check = (): void => {
    if (done) return;
    if (el.isConnected && el.clientWidth > 8 && el.clientHeight > 8) {
      stop();
      cb();
      return;
    }
    raf = requestAnimationFrame(check);
  };

  ro = new ResizeObserver(check); // fires immediately; check() is safe
  ro.observe(el);
  raf = requestAnimationFrame(check);
  return stop;
}

/* ------------------------------------------------------------------- panel */
export function buildAtlasPanel(lang: Lang): HTMLElement {
  const s = S[lang];
  teardown();

  const stage = h("div", { class: "atlas-stage" });
  const mapEl = h("div", { class: "atlas-map" });
  const overlay = h("div", { class: "atlas-overlay" });
  stage.append(mapEl, overlay);

  const notes = h("div", { class: "atlas-gaps" });
  const status = h("p", { class: "atlas-status", text: "" });

  /* ---------------- clusters (bar charts) ---------------- */
  const clusterRows: AtlasRow[] = ATLAS.filter((r) => r.cluster && r.at);
  const globalMax = Math.max(
    1,
    ...clusterRows.flatMap((r) =>
      [r.y, r.z, r.a].map((v) => (typeof v === "number" ? v : 0)),
    ),
  );
  const yMax = Math.ceil(globalMax * 1.15);

  const boxes: HTMLElement[] = [];
  for (const row of clusterRows) {
    const vals: Record<string, number | null | undefined> = {
      Y: row.y,
      Z: row.z,
      A: row.a,
    };
    const present = SERIES.filter((se) => typeof vals[se.key] === "number");
    const anchor: Cluster = {
      el: null as unknown as HTMLElement,
      latlng: row.at!,
      offset: row.offset ?? [0, 0],
      id: row.id,
    };

    if (!present.length) {
      const empty = h(
        "div",
        { class: "atlas-cluster atlas-cluster--empty" },
        h("span", { text: s.none }),
      );
      boxes.push(empty);
      anchor.el = empty;
      live.clusters.push(anchor);
      continue;
    }

    const chartBox = h(
      "div",
      { class: "atlas-cluster-chart" },
      h("canvas", { id: `atlasbar-${row.id}` }),
    );
    const label = h(
      "div",
      { class: "atlas-cluster-label" },
      h("b", { text: lang === "fr" ? row.fr : row.en }),
      h("span", {
        class: "atlas-cluster-count",
        text: `${row.inProgress ?? 0} ${s.open} · ${row.resolved ?? 0} ${s.closed}`,
      }),
      ...SERIES.filter((se) => typeof vals[se.key] !== "number").map((se) =>
        h("i", { class: "atlas-cluster-gap", text: `${se.key} ${s.missing}` }),
      ),
    );
    const box = h("div", { class: "atlas-cluster" }, chartBox, label);
    boxes.push(box);
    anchor.el = box;
    live.clusters.push(anchor);
  }
  overlay.append(...boxes);

  const rowForDept = (code: string): AtlasRow | undefined =>
    ATLAS.find((r) => r.level === "dept" && normCode(r.code) === code);

  const xMax = Math.max(
    1,
    ...ATLAS.map((r) => (typeof r.x === "number" ? r.x : 0)),
  );

  /* ---------------- charts ---------------- */
  const createCharts = (): void => {
    for (const row of clusterRows) {
      const vals: Record<string, number | null> = {
        Y: typeof row.y === "number" ? row.y : null,
        Z: typeof row.z === "number" ? row.z : null,
        A: typeof row.a === "number" ? row.a : null,
      };
      if (!SERIES.some((se) => vals[se.key] !== null)) continue;

      mount(`atlasbar-${row.id}`, {
        type: "bar",
        data: {
          labels: [lang === "fr" ? row.fr : row.en],
          datasets: SERIES.map((se) => ({
            label: se.key,
            data: [vals[se.key]],
            backgroundColor: se.colour,
            borderWidth: 0,
            borderRadius: 2,
            barPercentage: 0.9,
            categoryPercentage: 0.86,
          })),
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          layout: { padding: { top: 14, right: 10, left: 2, bottom: 0 } },
          plugins: {
            legend: { display: false },
            tooltip: {
              displayColors: true,
              callbacks: {
                title: () => (lang === "fr" ? row.fr : row.en),
                label: (ctx) => `${ctx.dataset.label}: ${ctx.raw ?? "—"}`,
              },
            },
          },
          scales: {
            x: {
              display: false,
              grid: { display: false },
              border: { display: false },
            },
            y: {
              display: false,
              beginAtZero: true,
              max: yMax,
              grid: { display: false },
              border: { display: false },
            },
          },
        },
        plugins: [isoBars],
      });
    }
  };

  /* ---------------- map (created only once laid out) ---------------- */
  let place: () => void = () => {};

  const initMap = (): void => {
    if (live.dead) return;

    const map = L.map(mapEl, {
      zoomControl: false,
      attributionControl: true,
      preferCanvas: true,
      minZoom: 4,
      maxZoom: 11,
      zoomSnap: 0.25,
      scrollWheelZoom: false,
      dragging: true,
      // give the constructor a view immediately; fitBounds refines it
      center: OCCITANIE_CENTER,
      zoom: OCCITANIE_ZOOM,
    });
    live.map = map;
    map.attributionControl.setPrefix(false);
    map.attributionControl.addAttribution(s.source);

    map.invalidateSize({ pan: false });
    live.ready = true;

    let tileErrors = 0;
    const tiles = L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png",
      { subdomains: "abcd", maxZoom: 20, opacity: 0.55, detectRetina: true },
    ).addTo(map);
    tiles.on("tileerror", () => {
      if (++tileErrors >= 4) mapEl.classList.add("atlas-notiles");
    });
    tiles.on("tileload", () => {
      tileErrors = 0;
      mapEl.classList.remove("atlas-notiles");
    });

    L.control.zoom({ position: "bottomright" }).addTo(map);

    place = (): void => {
      const m = live.map;
      if (!m || !live.ready || live.dead) return;
      const size = m.getSize();
      if (!size.x || !size.y) return;

      for (const c of live.clusters) {
        let p: L.Point;
        try {
          p = m.latLngToContainerPoint(c.latlng);
        } catch {
          return;
        }
        const w = c.el.offsetWidth || 150;
        const chH = c.el.classList.contains("atlas-cluster--empty") ? 20 : 96;
        c.el.style.transform =
          `translate3d(${Math.round(p.x - w / 2 + c.offset[0])}px,` +
          `${Math.round(p.y - chH - 10 + c.offset[1])}px,0)`;
      }
    };
    live.place = place;
    map.on("load move zoom viewreset resize zoomend moveend", place);

    createCharts();
    void drawGeometry();
    place();
  };

  const drawGeometry = async (): Promise<void> => {
    const depts = await firstJson(GEO.depts);
    const m = live.map;
    if (!m || live.dead) return;

    if (!depts) {
      status.textContent = s.offline;
      m.fitBounds(OCCITANIE_BOUNDS, { padding: [30, 30], animate: false });
      console.warn("[atlas] no department geometry; using fallback bounds");
      return;
    }

    const features = depts.features.filter((f) =>
      OCCITANIE_CODES.has(featureCode(f)),
    );
    console.info("[atlas] dept features", {
      payload: depts.features.length,
      matched: features.length,
      codes: features.map(featureCode),
    });
    if (!features.length) {
      status.textContent = s.offline;
      m.fitBounds(OCCITANIE_BOUNDS, { padding: [30, 30], animate: false });
      return;
    }

    const layer = L.geoJSON(
      { type: "FeatureCollection", features } as Collection,
      {
        style: (f) => {
          const x = rowForDept(f ? featureCode(f) : "")?.x;
          const none = typeof x !== "number";
          return {
            color: "#0b0e14",
            weight: 1,
            fillColor: none ? "#0f141d" : ramp(x / xMax),
            fillOpacity: none ? 0.85 : 0.9,
            dashArray: none ? "3 4" : undefined,
          };
        },
        onEachFeature: (f, lyr) => {
          const row = rowForDept(featureCode(f));
          const x = row?.x;
          lyr.bindTooltip(
            `${featureName(f)} — X: ${typeof x === "number" ? x : s.noData}` +
              (row?.inProgress || row?.resolved
                ? ` · ${row.inProgress ?? 0} ${s.open} / ${row.resolved ?? 0} ${s.closed}`
                : ""),
            { sticky: true, className: "atlas-tip" },
          );
          lyr.on({
            mouseover: () =>
              (lyr as L.Path).setStyle({ weight: 1.8, color: "#e6eaf2" }),
            mouseout: () => layer.resetStyle(lyr as L.Path),
          });
        },
      },
    ).addTo(m);
    live.layer = layer;

    // Fit BEFORE loading communes so the map settles once, not twice.
    const b = layer.getBounds();
    m.fitBounds(b.isValid() ? b : OCCITANIE_BOUNDS, {
      padding: [30, 30],
      animate: false,
    });
    m.invalidateSize({ pan: false });
    place();

    const communes = await firstJson(GEO.communes);
    if (!live.map || live.dead) return;
    const mp = communes?.features.find(
      (f) =>
        featureCode(f) === "34172" ||
        featureName(f).toLowerCase() === "montpellier",
    );
    if (mp) {
      L.geoJSON(mp, {
        style: { color: "#ffd166", weight: 1.6, fill: false, dashArray: "4 3" },
      }).addTo(m);
    }
    place();
  };

  /* ---------------- missing-value audit ---------------- */
  const gaps: string[] = [];
  for (const row of ATLAS) {
    const rec = row as unknown as Record<string, unknown>;
    const miss = SERIES.filter(
      (se) => typeof rec[se.key.toLowerCase()] !== "number",
    ).map((se) => se.key);
    if (miss.length && (row.cluster || typeof row.x === "number")) {
      gaps.push(
        `${lang === "fr" ? row.fr : row.en} — ${miss.join(", ")} ${s.missing}`,
      );
    }
  }
  notes.append(
    h("b", { text: `${s.gaps} ` }),
    h("span", { text: gaps.length ? gaps.join(" · ") : s.noGaps }),
  );

  /* ---------------- panel ---------------- */
  const panel = h(
    "div",
    { class: "panel atlas" },
    h(
      "div",
      { class: "atlas-head" },
      h(
        "div",
        null,
        h("h2", null, s.title),
        h("p", { class: "atlas-sub", text: s.sub }),
      ),
      h("span", { class: "atlas-badge", text: s.dummy }),
    ),
    stage,
    h(
      "div",
      { class: "atlas-foot" },
      h(
        "div",
        { class: "atlas-legend" },
        h("span", { class: "atlas-ramp", title: s.xLegend }),
        h("small", { text: `X: 0 → ${xMax}` }),
        ...SERIES.map((se) =>
          h(
            "span",
            { class: "atlas-key" },
            h("i", { style: `background:${se.colour}` }),
            h("small", { text: se.key }),
          ),
        ),
      ),
      notes,
      status,
    ),
  );

  // The panel is built detached and appended by page.ts, so nothing may touch
  // Leaflet before this fires.
  live.stopWaiting = onLaidOut(stage, initMap);

  const ro = new ResizeObserver(() => {
    if (live.dead) return;
    const m = live.map;
    if (!m) return;
    m.invalidateSize({ pan: false });
    live.place?.();
  });
  live.ro = ro;
  ro.observe(stage);

  // Debug handle: window.__atlas.map.getSize(), .layer, .reflow()
  (window as unknown as Record<string, unknown>).__atlas = {
    map: () => live.map,
    layer: () => live.layer,
    clusters: () => live.clusters.length,
    reflow: () => {
      live.map?.invalidateSize();
      live.place?.();
    },
  };

  return panel;
}
