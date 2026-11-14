type Child = Node | string | null | false | undefined;

export function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs?: Record<string, unknown> | null,
  ...children: Child[]
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) {
      if (v === null || v === undefined || v === false) continue;
      if (k === "class") el.className = String(v);
      else if (k === "text") el.textContent = String(v);
      else if (k === "html") el.innerHTML = String(v);
      else if (k === "dataset") {
        for (const [dk, dv] of Object.entries(v as Record<string, string>)) {
          el.dataset[dk] = String(dv);
        }
      } else if (k.startsWith("on") && typeof v === "function") {
        el.addEventListener(k.slice(2).toLowerCase(), v as EventListener);
      } else if (k in el) {
        (el as unknown as Record<string, unknown>)[k] = v;
      } else {
        el.setAttribute(k, String(v));
      }
    }
  }
  for (const c of children) {
    if (c === null || c === undefined || c === false) continue;
    el.append(c);
  }
  return el;
}

export function clear(el: Element): void {
  while (el.firstChild) el.removeChild(el.firstChild);
}

export function qs<T extends Element>(sel: string, root: ParentNode = document): T {
  const el = root.querySelector(sel);
  if (!el) throw new Error(`missing element: ${sel}`);
  return el as T;
}

export const DAY = 86_400_000;

export function utc(iso: string): number {
  return Date.parse(`${iso}T00:00:00Z`);
}

export function daysBetween(from: string, to: string): number {
  return Math.round((utc(to) - utc(from)) / DAY);
}

export function fmtDate(iso: string, lang: string): string {
  const d = new Date(utc(iso));
  return d.toLocaleDateString(lang === "fr" ? "fr-FR" : "en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function fmtShort(iso: string, lang: string): string {
  const d = new Date(utc(iso));
  return d.toLocaleDateString(lang === "fr" ? "fr-FR" : "en-GB", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "UTC",
  });
}
