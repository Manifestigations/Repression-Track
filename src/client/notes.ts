export interface Note {
  title: string;
  body: string;
  unverified?: boolean;
}

export const NOTES: Note[] = [
  {
    title: "A prefectoral ban HAS been annulled",
    body: "On 10 November the TA Paris annulled the Préfecture de police's order banning the Bastille–Pitié-Salpêtrière route for the student coordination, holding that the security note was « peu précise et peu circonstanciée » and that the incidents of 24 October, 31 October and 7 November did not establish a renewed risk. The court found an « atteinte grave et manifestement illégale à la liberté de manifester ». This supersedes the earlier note stating that no prefectural ban had been annulled.",
  },
  {
    title: "Two opposite annulments on the same subject",
    body: "On 31 October the Conseil d'État annulled the TA Paris judgment, restoring the ban on the Bastille–Nation route. Reading either decision without its object produces the wrong answer: CE 521001 annuls a decision refusing the ban, the TA of 10 November annuls the ban itself.",
  },
  {
    title: "Nothing is scheduled for decision in Hérault",
    body: "No annulation judgment on the October arrêtés is listed. The November rolls were stopped on 3 November with no manifestation case on them; expect a December fixing, and a reserved judgment delivered weeks after any hearing.",
  },
  {
    title: "Emergency relief settled nothing on the merits",
    body: "Almost everything here is référé-liberté (CJA L. 521-2): the judge rules within 48 hours on the day, and the recours en annulation remains open before the TA, then the CAA, then the CE.",
  },
  {
    title: "Three distinct criminal regimes",
    body: "Do not merge them. (1) Investigation and GAV allocation. (2) Sentences, appealable — the 9 cases declared « non saisis » at Paris for exceeding the 20-hour presentation deadline are nullities of procedure, not acquittals. (3) Judicial measures such as the Nantes « interdiction de manifester », which is a controlJudicial measure and cannot be challenged before the administrative court.",
  },
  {
    title: "Open data routes are undocumented and versioned",
    body: "The platform states it 'ne comporte pas d'API'. Route families have already shifted once (elastic/decisions now 404s). Pin the route and re-verify each run.",
  },
  {
    title: "Unverified entries are flagged",
    body: "Rows marked with a warning triangle have not been opened or screened. Several rest on press summaries whose source page has since returned 404 — notably the Montpellier 5 November arrests, for which the France 3 Occitanie page is gone.",
  },
  {
    title: "Two instruments, two notification dates",
    body: "The CE recites an arrêté of 22 October « confirmé par un arrêté du lendemain »; the TA order describes the 22 October arrêté as revealed by a press communiqué. Both notification dates are the pivot of the CPI L. 211-4 ground.",
    unverified: true,
  },
];

export const SANCTIONS = [
  "Retroactivity: an annulled arrêté is deemed never to have existed, so the contravention basis for participants disappears (R. 644-4 / R. 644-5-1 CP). This is the sharpest point: the 24 October arrests in Paris, Nantes, Brest and Montpellier were all prosecuted under orders later suspended or annulled.",
  "The practical asymmetry: the Paris annulment of 10 November concerns an order for a demonstration that had not yet taken place, so its retroactive effect is limited. The annulled or suspended orders of 24 October concern demonstrations that did happen and where arrests occurred — there the retroactivity argument is live.",
  "State liability: compensation for the wrongful ban and, for the policing operation itself, faute lourde (CE, 31 May 2024, n° 468316).",
  "No automatic personal sanction on the préfet: disciplinary liability before the Minister of the Interior is the real channel.",
  "Criminal exposure arises only beyond the annulled decision — abus d'autorité (CP 432-1 ff.) if the ban is maintained to defeat a judgment.",
  "No judicial bar on future bans, but a fresh order is required, cannot regularise the old one, and must be justified on the persistence of proven risk.",
  "The annulment of 10 November is a référé decision, not a merits ruling. The administration may appeal to the CAA Paris within two months (estimated 10 January 2027) and re-issue an order on the same day.",
];
