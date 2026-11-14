export interface Note {
  title: string;
  body: string;
  unverified?: boolean;
}

export const NOTES: Note[] = [
  {
    title: "A government ban has now been cancelled by a court",
    body: "On 10 November the Paris administrative tribunal cancelled a police-prefect's order that had banned the student coordination's route. The court found the internal security briefing 'too imprecise and too lacking in detail', and said the incidents of 24 and 31 October and 7 November did not establish a fresh risk of disorder. It concluded that the order 'seriously and manifestly unlawfully infringed the freedom to demonstrate'. This replaces the earlier note saying no ban had been cancelled.",
  },
  {
    title: "Two opposite cancellations that are easy to confuse",
    body: "On 31 October the Conseil d'État cancelled the Paris tribunal's ruling, which restored the ban on the Bastille–Nation route. On 10 November the Paris tribunal cancelled a ban. So 'cancelled' has meant two different things eight days apart: once the court's refusal to allow the march, once the government's ban itself. Every row in this tracker says which one it means.",
  },
  {
    title: "Nothing is scheduled for a decision in Hérault",
    body: "No ruling on the October bans has been listed. The November hearing lists were frozen on 3 November with no demonstration case on them, so expect a date to be set in December and a judgment delivered some weeks after the hearing.",
  },
  {
    title: "Emergency rulings settle very little",
    body: "Almost everything here was decided in an emergency procedure where the judge has 48 hours to rule, usually on the night before or the morning of a demonstration. The full argument still has to happen later. That is why so many cases in this tracker are 'still running'.",
  },
  {
    title: "Three different criminal tracks, which should not be mixed up",
    body: "First, investigation and police custody: how long a person can be held, and which charges are considered. Second, sentencing: the prison terms, fines and suspended sentences actually imposed, appealable within ten days of the reading of the judgment (Code of procedure pénale, article 498). Third, judicial measures such as the Nantes order not to take part in demonstrations, which is a condition of judicial supervision (article 138, 3° bis) and cannot be challenged before an administrative court.",
  },
  {
    title: "Nine people were released because the clock ran out",
    body: "In nine Paris cases the court declared itself not seized, because the person had not been brought before a prosecutor or judge within the twenty hours allowed by article 803-3 of the Code of procedure pénale. That is a procedural failure, not an acquittal: the people were released and will be retried, and the prosecution itself is unaffected.",
  },
  {
    title: "Which offences can someone be charged with?",
    body: "Taking part in a demonstration that has been banned is a fourth-class contravention (Penal Code, article R. 644-4): a fine of €750, or €135 on the spot, with no violence required. Taking part in an undeclared demonstration is not itself an offence, but organising a banned or undeclared demonstration is a délit (article 431-9). Staying in an unlawful gathering after a dispersal order is a délit (article 431-4). A bill adopted in first reading by the Sénat on 28 October would turn participation in a banned demonstration into a délit as well.",
  },
  {
    title: "Two points to verify before quoting this tracker",
    body: "First, the one-month appeal period against an administrative court judgment is applied here on the basis of settled practice, but the consolidated text of article R. 421-1 as published on Légifrance states the two-month rule without spelling this out; the citation should be checked. Second, several open-data routes used to locate cases have already changed once, so each run needs re-verification.",
  },
  {
    title: "Rows marked with a warning triangle",
    body: "These are cases we know about but have not been able to read in full, usually because only a press summary survives and the original page has gone. Their details are provisional.",
    unverified: true,
  },
  {
    title: "Two dates for the same instrument",
    body: "The Conseil d'État describes an order of 22 October as 'revealed by the press communiqué and confirmed by an order the following day', while the tribunal's ruling describes the same order of 22 October as revealed by the communiqué. The two notification dates are the pivot of the argument that the organisers were not properly informed.",
    unverified: true,
  },
];

export const SANCTIONS = [
  "It wipes the slate. A cancelled order is treated as if it had never existed, so the legal basis for any prosecution under it disappears. This is the sharpest point in the whole dossier: the arrests made in Paris, Nantes, Brest and Montpellier in the days after 17 October were pursued under orders that have since been suspended or cancelled.",
  "But the timing decides how much it matters. The Paris cancellation of 10 November concerned a demonstration that had not happened yet, so its retroactive effect is limited. The suspended or cancelled orders of 24 October concerned demonstrations that did happen and did produce arrests — there the retroactivity argument is live.",
  "Money may follow. A person wrongly prevented from demonstrating can claim compensation for the harm done, and a person wrongly arrested can claim compensation for the harm of the arrest.",
  "For the policing operation itself, compensation requires something much stronger than an error: the state generally has to be shown to have been seriously at fault.",
  "No automatic punishment for the prefect. Disciplinary responsibility before the Minister of the Interior is the realistic route.",
  "Criminal exposure comes only further out: it would require a public official to keep a ban in force in order to defeat a judgment, which is the offence of abuse of power.",
  "There is no judicial ban on future bans. A fresh order can be issued the same day, but it cannot paper over the cancelled one and must justify itself on risks that still exist.",
  "And the 10 November cancellation is itself an emergency ruling, not a final judgment. The administration can appeal it to the Paris appeal court and re-issue an order.",
];
