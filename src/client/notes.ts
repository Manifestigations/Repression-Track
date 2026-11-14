export interface Note {
  title: string;
  body: string;
  unverified?: boolean;
}

export const NOTES: Note[] = [
  {
    title: "Nothing is scheduled for decision",
    body: "No annulation judgment on the October arrêtés is listed. The November rolls were stopped on 3 Nov with no manifestation case on them; expect a December fixing, and a reserved judgment delivered weeks after any hearing.",
  },
  {
    title: "Emergency relief settled nothing on the merits",
    body: "Almost everything here is référé-liberté (CJA L. 521-2): the judge rules within 48 hours on the day, and the recours en annulation remains open before the TA, then the CAA, then the CE.",
  },
  {
    title: "Distinguish judicial from prefectoral annulment",
    body: "The only annulment reported in the wave is CE 521001, which annulled a TA judgment — restoring a ban. No prefectoral ban has yet been annulled on the merits.",
    unverified: false,
  },
  {
    title: "Open data routes are undocumented and versioned",
    body: "The platform states it 'ne comporte pas d'API'. Route families have already shifted once (elastic/decisions now 404s). Pin the route and re-verify each run.",
  },
  {
    title: "Unverified entries are flagged",
    body: "Rows marked with a warning triangle have not been opened or screened. DTA 2608292 and CE 512621 are the only two documents that can change the merits picture.",
    unverified: true,
  },
  {
    title: "Two instruments, two notification dates",
    body: "The CE recites an arrêté of 22 Oct 'confirmé par un arrêté du lendemain'; the TA order describes the 22 Oct arrêté as revealed by press communiqué. Both notification dates are the pivot of the CPI L. 211-4 ground.",
    unverified: true,
  },
];

export const SANCTIONS = [
  "Retroactivity: an annulled arrêté is deemed never to have existed, so the contravention basis for participants disappears (R. 644-4 / R. 644-5-1 CP).",
  "State liability: compensation for the wrongful ban and, for the policing operation itself, faute lourde (CE, 31 May 2024, n° 468316).",
  "No automatic personal sanction on the préfet: disciplinary liability before the Minister of the Interior is the real channel.",
  "Criminal exposure arises only beyond the annulled decision — abus d'autorité (CP 432-1 ff.) if the ban is maintained to defeat a judgment.",
  "No judicial bar on future bans, but a fresh order is required, cannot regularise the old one, and must be justified on the persistence of proven risk.",
];
