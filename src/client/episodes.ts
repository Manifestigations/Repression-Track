export interface Episode {
  date: string;
  label: string;
  detail: string;
}

export const EPISODES: Episode[] = [
  { date: "2026-10-17", label: "17 Oct", detail: "35,000 demonstrators; ~5,000 casseurs; 15 shops pillaged; 48 police injured; 69 arrests." },
  { date: "2026-10-22", label: "22–24 Oct", detail: "Macron's statements; bans in 100+ cities; four référé orders rejected at TA Montpellier; CE 520786." },
  { date: "2026-10-31", label: "31 Oct", detail: "Second banned Saturday; ORTA 2608653 rejected; ~8,000 nevertheless marched." },
  { date: "2026-11-04", label: "4–7 Nov", detail: "ORTA 2608747 authorises the march on a modified route; 7 Nov rally undeclared, 5 arrests." },
  { date: "2026-11-09", label: "9–11 Nov", detail: "Two sommations judgments; attroupement charges dismissed; 20 arrests in the Écusson on 11 Nov." },
];
