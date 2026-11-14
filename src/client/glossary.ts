/**
 * Glossary for the tracker.
 *
 * Three kinds of entry:
 *  - "tracker"  words this tool invents to describe its own columns
 *  - "general"  legal words that mean the same thing in any legal system
 *  - "french"   words and institutions that only make sense in the French system
 *
 * Rule of writing: every definition must be understandable by a reader with no
 * legal training. No Latin, no unexplained abbreviations, no cross-references
 * without a pointer, no "see above".
 */

export type GlossaryKind = "tracker" | "general" | "french";

export interface GlossaryEntry {
  id: string;
  term: string;
  fr?: string;
  kind: GlossaryKind;
  plain: string;
  french?: string;
  law?: string;
  where?: string;
  see?: string[];
  aliases?: string[];
}

export const GLOSSARY: GlossaryEntry[] = [
  /* ================= HOW TO READ THIS TRACKER ================= */
  {
    id: "asof",
    term: "As-of date",
    kind: "tracker",
    plain:
      "The day the tracker was last checked. Every countdown is measured from that day, so a countdown may already be out of date if you are reading it later.",
    where: "Top right of the page.",
    see: ["countdown"],
  },
  {
    id: "ref",
    term: "Case reference",
    kind: "tracker",
    plain:
      "The short code that identifies a legal file: a court decision number, an order number, or a descriptive label where no public number exists.",
    where: "First column of the table.",
    see: ["forum"],
  },
  {
    id: "forum",
    term: "Forum (which court)",
    kind: "tracker",
    plain:
      "The body that decides the case, in plain words: a government tribunal, an appeal court, the highest court, a criminal court, or a prosecutor's office. This is where jargon like 'TA' or 'CE' would otherwise appear.",
    where: "Second column, under each case title.",
    see: ["jurisdiction", "ta", "caa", "ce"],
  },
  {
    id: "scope",
    term: "Territory",
    kind: "tracker",
    plain:
      "Which area of France the case belongs to. 'Hérault' is the original local dossier; 'Occitanie' is the wider south-west region; 'National' covers everything else, including cases decided in Paris that apply across the country.",
    where: "Filter menu.",
    see: ["national"],
  },
  {
    id: "tier",
    term: "Type of order",
    kind: "tracker",
    plain:
      "Three kinds of law work side by side here. Administrative law is about whether a government ban was lawful. Criminal law is about whether individuals committed offences. Indemnity law is about compensation for harm.",
    where: "Filter menu.",
    see: ["admin", "penal", "indemn"],
  },
  {
    id: "stage",
    term: "Stage",
    kind: "tracker",
    plain:
      "How far the case has got. A case starts as a government decision, may be challenged in an emergency hearing, may go to a full hearing, and on the criminal side moves from arrests to charges to a trial to a sentence and an appeal.",
    where: "Filter menu and fourth column.",
    see: ["refere", "fond", "audience", "appel"],
  },
  {
    id: "status",
    term: "Status",
    kind: "tracker",
    plain:
      "Where the file stands today: refused, allowed, still running, not yet checked against the original source, finished, or not applicable.",
    where: "Fifth column.",
  },
  {
    id: "outcome",
    term: "Outcome",
    kind: "tracker",
    plain:
      "What the decision actually did, in plain words. Watch for two opposite senses of the same word: 'cancelled' can mean the court struck down the government's ban, or that the court struck down the earlier refusal to allow the march. The tracker labels which.",
    where: "Under the status in the fifth column.",
    see: ["annule", "confirme", "suspendu"],
  },
  {
    id: "deadline",
    term: "Next deadline",
    kind: "tracker",
    plain:
      "The next date on which something must happen: a hearing, the last day to appeal, or the day an order takes effect. Each deadline shows the rule it comes from, so you can check it yourself.",
    where: "Sixth column.",
    see: ["countdown", "delai", "notification"],
  },
  {
    id: "countdown",
    term: "Countdown",
    kind: "tracker",
    plain:
      "Days from the as-of date to the deadline. Red means within a week, amber within three weeks, blue beyond that.",
    where: "Seventh column.",
    see: ["asof", "deadline"],
  },
  {
    id: "confidence",
    term: "Fixed / estimated / unknown",
    kind: "tracker",
    plain:
      "How sure we are of a date. 'Fixed' means a court or official document gave the date. 'Estimated' means we calculated it from a legal deadline and it may shift. 'Unknown' means no reliable date is available.",
    where: "Shown beside each deadline.",
    see: ["delai", "notification"],
  },
  {
    id: "unverified",
    term: "Unverified row",
    kind: "tracker",
    plain:
      "A line we know exists but have not been able to read in full — often because only a press summary survives and the original page is gone. We flag it rather than hide it. Treat the details as provisional.",
    where: "Warning triangle on the case title.",
    see: ["evidence"],
  },
  {
    id: "holding",
    term: "What the court held",
    kind: "tracker",
    plain:
      "The court's own reasoning, quoted. This is the part written in legal language; the glossary explains the words in it.",
    where: "Inside each case entry.",
    see: ["motifs", "juridiction"],
  },

  /* ================= GENERAL LEGAL WORDS ================= */
  {
    id: "appeal",
    term: "Appeal",
    kind: "general",
    plain:
      "Asking a higher court to check whether a decision was legally correct. Usually it does not redo the facts; it looks at whether the law was respected.",
    see: ["recoeur_annulation", "appel_admin"],
  },
  {
    id: "jurisdiction",
    term: "Jurisdiction",
    kind: "general",
    plain:
      "Which body is allowed to decide a case. In France the law splits this up: government decisions go before administrative courts, crimes and offences go before criminal courts.",
    see: ["forum", "ta", "competence"],
  },
  {
    id: "forum",
    term: "Court and level",
    kind: "general",
    plain:
      "The name of the deciding body and its place in the hierarchy — first instance, appeal, or highest court.",
    see: ["jurisdiction", "ta", "caa", "ce"],
  },
  {
    id: "hearing",
    term: "Hearing",
    kind: "general",
    plain:
      "The meeting where the parties argue a case and the judge decides. A hearing can decide everything, or only an urgent question.",
    see: ["audience", "refere"],
  },
  {
    id: "judge",
    term: "Judge",
    kind: "general",
    plain:
      "The public official who decides cases. In French criminal procedure, 'magistrate' covers both judges and prosecutors, which is why the word appears often in reporting.",
    see: ["prosecutor", "jld"],
  },
  {
    id: "prosecutor",
    term: "Prosecutor",
    kind: "general",
    plain:
      "The official who brings criminal cases and represents the state in court. Prosecutors decide whether to charge someone, and they request sentences — but they do not impose them; a judge does.",
    see: ["parquet", "darmanin"],
  },
  {
    id: "lawyer",
    term: "Lawyer",
    kind: "general",
    plain:
      "The person who argues a client's case. In France every defendant in a criminal case has the right to a lawyer, chosen or appointed by the court.",
  },
  {
    id: "defendant",
    term: "Defendant / accused",
    kind: "general",
    plain:
      "The person accused of an offence. 'Defendant' fits a court case; 'accused' fits someone the police are still questioning. A person is a suspect until charges are brought.",
    see: ["prevenu", "mis_en_examen"],
  },
  {
    id: "conviction",
    term: "Conviction",
    kind: "general",
    plain:
      "A finding that the person committed the offence they were charged with, and the sentence that follows.",
    see: ["acquittal", "sentence"],
  },
  {
    id: "acquittal",
    term: "Acquittal / dismissal",
    kind: "general",
    plain:
      "A finding that the case against the person fails, so they are released and face no penalty for it.",
    see: ["conviction", "relaxe"],
  },
  {
    id: "sentence",
    term: "Sentence",
    kind: "general",
    plain:
      "The punishment the court imposes: a fine, a suspended prison term, a prison term, community work, or a ban from certain places.",
    see: ["sursis", "tig", "mandat_depot", "droits_civiques"],
  },
  {
    id: "detention",
    term: "Custody / detention",
    kind: "general",
    plain:
      "Being held by the police or in prison before or after a case. French law treats pre-trial custody and prison sentences as different things with different rules.",
    see: ["gav", "detention_provisoire", "mandat_depot"],
  },
  {
    id: "injunction",
    term: "Order (court order)",
    kind: "general",
    plain:
      "A decision that commands someone to do something, or forbids it. A court's order is binding and can be enforced.",
    see: ["ordonnance", "arrete"],
  },
  {
    id: "proportionality",
    term: "Proportionality",
    kind: "general",
    plain:
      "The rule that a restrictive measure must not go further than the danger it addresses. A blanket ban across a whole city is harder to defend than a targeted one.",
    see: ["necessity", "motifs"],
  },
  {
    id: "necessity",
    term: "Necessity",
    kind: "general",
    plain:
      "The rule that a measure must be needed to stop a real risk — not merely convenient.",
    see: ["proportionality"],
  },
  {
    id: "evidence",
    term: "Evidence",
    kind: "general",
    plain:
      "The material used to prove what happened: witness statements, photographs, videos, forensic reports, and the documents officials relied on when they made their decision.",
    see: ["unverified", "note_service"],
  },
  {
    id: "due_process",
    term: "Fair procedure (due process)",
    kind: "general",
    plain:
      "The basic rule that a person must be heard, must know what they are accused of, must have time to prepare, and must have a way to challenge the decision.",
    see: ["notification", "refere"],
  },
  {
    id: "nullity",
    term: "Procedural nullity",
    kind: "general",
    plain:
      "When a decision is thrown out not because the outcome was wrong but because the process was broken — for example a deadline was missed. The case then has to be dealt with again.",
    see: ["non_saisi", "delai"],
  },
  {
    id: "precedent",
    term: "Case law / precedent",
    kind: "general",
    plain:
      "Earlier decisions that later courts follow. French judges are not strictly bound by precedent, but well-reasoned decisions are heavily relied on, which is why some rulings in this tracker matter beyond their own city.",
    see: ["holding"],
  },
  {
    id: "retroactivity",
    term: "Retroactivity",
    kind: "general",
    plain:
      "Applying a new rule to something that happened before it. If a ban is cancelled later, the people arrested under it can argue that the legal basis for their arrest has disappeared.",
    see: ["annule", "indemnite"],
  },
  {
    id: "compensation",
    term: "Compensation",
    kind: "general",
    plain:
      "Money paid to put someone back in the position they were in, or to acknowledge harm. It usually has to be claimed, and it is not automatic.",
    see: ["indemnite", "faute_lourde"],
  },
  {
    id: "indemnite",
    term: "Compensation claim",
    kind: "general",
    plain:
      "A claim for money after an unlawful government decision or a botched operation. Two different routes exist: one needs proof of fault, the other does not.",
    see: ["compensation", "faute_lourde", "l211_10"],
  },
  {
    id: "faute_lourde",
    term: "Serious fault",
    kind: "general",
    plain:
      "A very high standard of blame. When the state compensates for harm caused by the way an operation was carried out, it normally has to be shown that the error was serious, not merely unlucky.",
    see: ["indemnite"],
  },
  {
    id: "delai",
    term: "Deadline",
    kind: "general",
    plain:
      "The last date to act. Miss it and the chance is usually lost — French law calls this 'forclusion' in administrative cases: the court simply refuses to look at the case any more.",
    see: ["deadline", "notification", "delai_annulation"],
  },
  {
    id: "enforceable",
    term: "Enforceable (final)",
    kind: "general",
    plain:
      "A decision that can actually be carried out. In criminal cases a conviction is normally not enforceable while the appeal window is open or the appeal is running.",
    see: ["delai", "art_506"],
  },
  {
    id: "motifs",
    term: "Reasons (grounds)",
    kind: "general",
    plain:
      "The explanation a decision-maker gives for a decision. A court checks not only whether the outcome was reasonable but whether the stated reasons hold up.",
    see: ["holding", "proportionality"],
  },
  {
    id: "discretion",
    term: "Discretion",
    kind: "general",
    plain:
      "The room officials have to make a judgment call. The law allows discretion but still requires it to be reasoned and proportionate, and courts are there to check that.",
    see: ["motifs", "proportionality"],
  },
  {
    id: "liability",
    term: "Liability",
    kind: "general",
    plain:
      "Being legally responsible for something. Individual liability means one person answers; institutional liability means the state answers for its own agents.",
    see: ["abus_pouvoir", "faute_lourde"],
  },
  {
    id: "breach",
    term: "Breach",
    kind: "general",
    plain:
      "Breaking a rule that was in force at the time. One of the most important ideas in this tracker: if the rule was invalid, there was no breach.",
    see: ["annule", "retroactivity"],
  },

  /* ================= FRENCH LEGAL WORDS AND INSTITUTIONS ================= */
  {
    id: "prefect",
    term: "Prefect",
    fr: "préfet",
    kind: "french",
    plain:
      "The state representative in a department — the official who signs bans, couvre-feus and protective-equipment restrictions there. The prefect's decisions are administrative acts, so they are challenged in administrative court.",
    french:
      "In Paris the equivalent is the 'préfet de police', who is responsible for the whole capital; the mayor's police powers in Paris are exercised by the central government.",
    see: ["arrete", "ordre_public", "ta"],
  },
  {
    id: "mayor",
    term: "Mayor",
    fr: "maire",
    kind: "french",
    plain:
      "The head of the municipal council, who has their own police powers in the town. In practice, prefects take the decisions in this wave.",
    french:
      "The mayor normally passes the demonstration file to the prefect within 24 hours; if the mayor does nothing, the prefect may act in their place.",
    see: ["prefect", "l2215_1"],
  },
  {
    id: "arrete",
    term: "Prefectural order",
    fr: "arrêté préfectoral",
    kind: "french",
    plain:
      "A written decision by a prefect or the police prefect, signed and published, which sets a rule — a ban, a couvre-feu, a restricted zone, a ban on protective equipment. This is the kind of document most of the administrative rows in the tracker concern.",
    french:
      "An 'arrêté' is an administrative act. It has to be written, reasoned, signed, and published; it can be challenged before the administrative courts; and once cancelled it is treated as if it had never existed.",
    see: ["publication", "raa", "notification", "annule"],
  },
  {
    id: "declaration",
    term: "Prior declaration",
    fr: "déclaration préalable",
    kind: "french",
    plain:
      "The notice organisers must file with the town hall or prefecture at least three days before a demonstration, giving the organisers' names, the purpose, the place, the date, the time and the planned route.",
    french:
      "Taking part in an undeclared demonstration is not itself an offence. Taking part in a demonstration that has been formally banned is a contravention, whatever happens on the ground.",
    see: ["r644_4", "l211_2"],
  },
  {
    id: "interdiction",
    term: "Ban",
    fr: "interdiction",
    kind: "french",
    plain:
      "A rule prohibiting a demonstration, a route, a gathering, or an item of clothing. A ban can cover the whole event or only a mapped area.",
    see: ["perimetrique", "couvre_feu", "epi"],
  },
  {
    id: "perimetrique",
    term: "Area ban",
    fr: "interdiction périmétrique",
    kind: "french",
    plain:
      "A ban that does not cancel the demonstration but excludes a mapped zone — often the city centre — so the march has to go somewhere else.",
    french:
      "The Conseil d'État accepts this, provided the restriction is justified by the circumstances and limited in both area and time.",
    see: ["interdiction", "proportionality"],
  },
  {
    id: "couvre_feu",
    term: "C curfew",
    fr: "couvre-feu",
    kind: "french",
    plain:
      "A rule forbidding people from being out in a defined area during defined hours. It is a restriction on everyday movement, not on demonstrating.",
    french:
      "A couvre-feu is lawful only in response to a specific risk to public order and cannot be extended indefinitely; its usual home is areas with concentrated local disorder and, historically, unaccompanied minors.",
    see: ["interdiction", "proportionality", "periode"],
  },
  {
    id: "epi",
    term: "Protective equipment",
    fr: "équipements de protection individuelle (EPI)",
    kind: "french",
    plain:
      "Helmets, ski or safety goggles, gas masks and joint protectors. Several prefects banned carrying them near demonstrations, which collided with medics and human-rights observers.",
    french:
      "To ban such an object under the demonstration rules, it must be an object that could count as a 'weapon' under article 132-75 of the Penal Code. That is why the legal basis of an EPI ban, and its territorial and time limits, have been challenged.",
    see: ["arme", "l211_3", "nancy_epi"],
  },
  {
    id: "arme",
    term: "Weapon",
    fr: "arme (article 132-75 du code pénal)",
    kind: "french",
    plain:
      "The law's definition of a weapon, used as the trigger for restricting what people carry at demonstrations.",
    french:
      "The definition covers anything designed or used to kill, injure or destroy, and anything adapted to be thrown or fired as a projectile. Ordinary protective gear does not fall inside it.",
    see: ["epi", "l211_3"],
  },
  {
    id: "ordre_public",
    term: "Public order",
    fr: "ordre public",
    kind: "french",
    plain:
      "The French legal shorthand for the absence of serious disorder and the safety of people and property. It is the stated legal reason behind nearly every ban in this tracker, so the argument in each case is about whether the risk was real, specific and current.",
    see: ["prefect", "l211_4", "proportionality", "note_service"],
  },
  {
    id: "l211_2",
    term: "Article L. 211-2 (declaration)",
    fr: "article L. 211-2 du code de la sécurité intérieure",
    kind: "french",
    plain:
      "The article requiring the prior declaration of a demonstration and setting out what it must contain.",
    law: "CPI L. 211-2",
    see: ["declaration"],
  },
  {
    id: "l211_3",
    term: "Article L. 211-3 (carrying weapon-like objects)",
    fr: "article L. 211-3 du code de la sécurité intérieure",
    kind: "french",
    plain:
      "Lets the prefect ban, without a legitimate reason, carrying or transporting objects that could constitute a weapon, from the 24 hours before a demonstration until it disperses.",
    french:
      "The area must stay limited to the demonstration, nearby places and access routes, and must remain proportionate. Protective equipment is only covered if it qualifies as a weapon under the Penal Code.",
    law: "CPI L. 211-3",
    see: ["epi", "arme"],
  },
  {
    id: "l211_4",
    term: "Article L. 211-4 (banning a demonstration)",
    fr: "article L. 211-4 du code de la sécurité intérieure",
    kind: "french",
    plain:
      "The article that lets the authority with police powers prohibit a demonstration it considers likely to disturb public order, by an order notified immediately to the organisers who signed the declaration.",
    french:
      "The mayor passes the declaration to the prefect within 24 hours; if the mayor abstains from banning, the prefect may act under the general police-power article.",
    law: "CPI L. 211-4",
    see: ["arrete", "notification", "l2215_1", "r644_4"],
  },
  {
    id: "l211_10",
    term: "Article L. 211-10 (compensation)",
    fr: "article L. 211-10 du code de la sécurité intérieure",
    kind: "french",
    plain:
      "The article that allows compensation for people who suffered damage because of an unlawful gathering, without having to prove anyone's fault.",
    law: "CPI L. 211-10",
    see: ["indemnite", "compensation"],
  },
  {
    id: "l2215_1",
    term: "Article L. 2215-1 (general police powers)",
    fr: "article L. 2215-1 du code général des collectivités territoriales",
    kind: "french",
    plain:
      "The prefect's general power to take protective measures where the municipal authorities have not done so, and to act alone where the problem crosses more than one commune.",
    french:
      "It is a general police-power article, with no reference to demonstrations or to protective equipment, and it requires prior formal notice to the mayor before acting in a single commune.",
    law: "CGCT L. 2215-1",
    see: ["prefect", "l211_4", "pouvoir_police"],
  },
  {
    id: "pouvoir_police",
    term: "Administrative police powers",
    fr: "pouvoirs de police administrative",
    kind: "french",
    plain:
      "The legal powers officials use to keep order. In France these belong to the executive, and the courts only check that the powers were used lawfully, not that they were the right policy choice.",
    see: ["ordre_public", "l2215_1", "discretion"],
  },
  {
    id: "ta",
    term: "Administrative tribunal",
    fr: "tribunal administratif (TA)",
    kind: "french",
    plain:
      "The first-instance court for government decisions. It hears challenges to prefectural orders and to decisions of public bodies.",
    french:
      "It has an emergency chamber (the 'juge des référés') and a full chamber. A case decided on the merits there can be appealed to the appeal court.",
    see: ["caa", "ce", "refere", "juridiction"],
  },
  {
    id: "caa",
    term: "Administrative appeal court",
    fr: "cour administrative d'appel (CAA)",
    kind: "french",
    plain:
      "The second level. It reviews decisions of the administrative tribunal in its area — for example Montpellier for Hérault, Bordeaux for Gironde, Paris for the capital.",
    see: ["ta", "ce", "appel_admin"],
  },
  {
    id: "ce",
    term: "Council of State",
    fr: "Conseil d'État (CE)",
    kind: "french",
    plain:
      "France's highest administrative court, sitting in Paris. It is also the court that hears emergency appeals from anywhere in the country, and it reviews lower courts on points of law.",
    french:
      "It rules on a large number of references (questions of law) that apply across the whole country, which is why a single decision here can reshape the legal position in every city.",
    see: ["ta", "caa", "refere"],
  },
  {
    id: "refere",
    term: "Emergency ruling",
    fr: "référé / référé-liberté",
    kind: "french",
    plain:
      "A fast track for stopping an ongoing or imminent violation of a fundamental freedom. The judge must rule within 48 hours, which is why the timing of the application matters so much.",
    french:
      "A 'référé-liberté' is used against a government measure that threatens a fundamental freedom such as the freedom to demonstrate. The ruling is provisional: the case must still be argued later on the merits.",
    law: "CJA L. 521-1 to L. 521-2",
    see: ["ta", "delai", "due_process", "appeal_refere"],
  },
  {
    id: "appeal_refere",
    term: "Appeal against an emergency ruling",
    kind: "french",
    plain:
      "An emergency ruling can itself be challenged, within 15 days of being notified, before the Conseil d'État's emergency judge.",
    law: "CJA L. 521-2",
    see: ["refere", "ce", "delai"],
  },
  {
    id: "juge_referes",
    term: "Emergency judge",
    fr: "juge des référés",
    kind: "french",
    plain:
      "The single judge who handles emergency applications at each administrative court. It is a different judge from the one who will later decide the case on the merits.",
    see: ["refere", "ta"],
  },
  {
    id: "ordonnance",
    term: "Court order (decision)",
    fr: "ordonnance",
    kind: "french",
    plain:
      "The written decision a court issues. An 'arrêt' is a decision of a court of appeal or of the Conseil d'État; an 'ordonnance' is typically a decision of a single judge or of a first-instance court.",
    see: ["arrete", "holding"],
  },
  {
    id: "recoeur_annulation",
    term: "Challenge for cancellation",
    fr: "recours en annulation",
    kind: "french",
    plain:
      "The standard way to ask an administrative court to strike down a government decision. It must be filed within two months of the decision being notified or published.",
    law: "CJA R. 421-1",
    see: ["delai_annulation", "ta", "annule"],
  },
  {
    id: "delai_annulation",
    term: "Two-month window",
    kind: "french",
    plain:
      "Two months from the notification or publication of the decision being challenged. If the deadline passes, the court will refuse to consider the case.",
    law: "CJA R. 421-1",
    see: ["recoeur_annulation", "delai", "notification"],
  },
  {
    id: "appel_admin",
    term: "Appeal against an administrative court judgment",
    kind: "french",
    plain:
      "The administration (or the other side) can ask the appeal court to review a tribunal's judgment. The period is one month rather than two — this point is flagged in the tracker as needing a final citation check.",
    see: ["caa", "delai", "annule"],
  },
  {
    id: "notification",
    term: "Notification",
    fr: "notification",
    kind: "french",
    plain:
      "Formal delivery of a decision to the person concerned. It starts the clock for appealing, so a decision is not challengeable until it has been notified or published.",
    see: ["delai", "publication", "raa", "due_process"],
  },
  {
    id: "publication",
    term: "Publication",
    fr: "publication",
    kind: "french",
    plain:
      "Making a decision public, usually in the official collection of departmental orders. Publication also starts the appeal clock where the person concerned cannot be notified directly.",
    see: ["raa", "notification", "delai"],
  },
  {
    id: "raa",
    term: "Official collection of orders",
    fr: "recueil des actes administratifs (RAA)",
    kind: "french",
    plain:
      "The official bulletin where a prefecture publishes its orders. It is often the first public sign that a ban exists — sometimes days before anyone can realistically appeal it.",
    see: ["publication", "arrete"],
  },
  {
    id: "motifs",
    term: "Stated reasons",
    fr: "motifs",
    kind: "french",
    plain:
      "The explanation attached to a decision. A court will cancel a ban if the reasons are too vague, or if the facts relied on do not support the conclusion.",
    see: ["note_service", "proportionality", "annule"],
  },
  {
    id: "note_service",
    term: "Internal briefing note",
    fr: "note de service",
    kind: "french",
    plain:
      "The internal document in which officials explain the risk they are relying on to justify a ban. It is often the weakest link in a decision, because the court asks whether the stated reasons are precise and factually supported.",
    see: ["motifs", "annule", "evidence"],
  },
  {
    id: "competence",
    term: "Legal competence",
    fr: "compétence",
    kind: "french",
    plain:
      "Whether a body is entitled to deal with a matter at all. If the wrong authority decides, the decision can be cancelled without anyone having to argue about the merits.",
    see: ["juridiction", "l2215_1"],
  },
  {
    id: "ordre_public_moyen",
    term: "Ground of public order (raised by the court itself)",
    fr: "moyen d'ordre public",
    kind: "french",
    plain:
      "A legal point that a court can raise by itself, even if nobody raised it. In this dossier it matters: one case was thrown out on a ground nobody had argued.",
    see: ["l522_3", "motifs"],
  },
  {
    id: "l522_3",
    term: "Article L. 522-3 (manifestation manifestly unfounded)",
    fr: "article L. 522-3 du code de justice administrative",
    kind: "french",
    plain:
      "Lets the Conseil d'État dismiss an emergency application without holding a hearing, where the objection is manifestly unfounded. It is fast, and it means no reasons are given.",
    see: ["ordre_public_moyen", "refere", "ce"],
  },
  {
    id: "dernier_recours",
    term: "Last-resort test",
    fr: "test du dernier recours",
    kind: "french",
    plain:
      "The rule that an emergency court will not step in if the case can still be argued later, in full, before a judge who can hold a hearing. It explains why many challenges failed at the emergency stage.",
    see: ["refere", "ce", "ta"],
  },
  {
    id: "annule",
    term: "Cancellation",
    fr: "annulation",
    kind: "french",
    plain:
      "A court striking down a government decision. The decision is treated as if it had never existed, which is why it can affect people already prosecuted under it.",
    see: ["retroactivity", "breach", "recoeur_annulation"],
  },
  {
    id: "suspendu",
    term: "Suspension",
    fr: "suspension",
    kind: "french",
    plain:
      "A court temporarily setting a ban aside while the case continues. The ban comes back if the case is lost, so it is not the same as cancellation.",
    see: ["annule", "refere"],
  },
  {
    id: "confirme",
    term: "Upheld",
    fr: "confirmation",
    kind: "french",
    plain:
      "The court found the government's decision lawful and left it standing.",
    see: ["annule", "suspendu"],
  },
  {
    id: "controle_leg",
    term: "Review of legality",
    fr: "contrôle de légalité",
    kind: "french",
    plain:
      "Checking a decision against the law rather than re-deciding the policy question. It is the ordinary way an administrative court works.",
    see: ["ta", "motifs"],
  },
  {
    id: "contravention",
    term: "Contravention",
    fr: "contravention",
    kind: "french",
    plain:
      "The least serious category of offence. It is judged by a police court, and fines are capped low.",
    see: ["delit", "crime", "r644_4"],
  },
  {
    id: "delit",
    term: "Delit (indictable offence)",
    fr: "délit",
    kind: "french",
    plain:
      "The middle category of offence, more serious than a contravention and less serious than a crime. Most of the offences in this tracker are délits, tried by the criminal court.",
    see: ["contravention", "crime"],
  },
  {
    id: "crime",
    term: "Crime",
    fr: "crime",
    kind: "french",
    plain:
      "The most serious category, heard by the assize court. Rarely relevant here.",
    see: ["delit", "contravention"],
  },
  {
    id: "r644_4",
    term: "Article R. 644-4 (taking part in a banned demonstration)",
    fr: "article R. 644-4 du code pénal",
    kind: "french",
    plain:
      "Makes it a fourth-class contravention — a fine of €750, or €135 on the spot — to take part in a demonstration banned under the public-order rules. No violence is required, and it applies even if the demonstration is peaceful.",
    french:
      "Taking part in an undeclared demonstration is not itself an offence. Organising a banned or undeclared demonstration is a délit (article 431-9 of the Penal Code). A bill adopted in first reading by the Sénat on 28 October would reclassify participation as a délit carrying up to six months' imprisonment and €7,500.",
    law: "CP R. 644-4",
    see: ["declaration", "l211_4", "contravention"],
  },
  {
    id: "r644_5_1",
    term: "Article R. 644-5-1 (breaching police orders)",
    fr: "article R. 644-5-1 du code pénal",
    kind: "french",
    plain:
      "Makes it a fourth-class contravention to breach a prohibition or obligation imposed by a decree or order regulating presence and circulation after disorder. This is the article usually charged against people who joined a demonstration in a banned area.",
    law: "CP R. 644-5-1",
    see: ["r610_5", "contravention", "arrete"],
  },
  {
    id: "r610_5",
    term: "Article R. 610-5 (breaching a general police rule)",
    fr: "article R. 610-5 du code pénal",
    kind: "french",
    plain:
      "The lighter fallback charge — a second-class contravention — for breaching a police prohibition that is not tied to post-disorder regulations.",
    law: "CP R. 610-5",
    see: ["r644_5_1"],
  },
  {
    id: "attroupement",
    term: "Unlawful gathering",
    fr: "attroupement",
    kind: "french",
    plain:
      "A group forming in public in a way that threatens public order, whether or not it is a declared demonstration. The law treats staying in such a group after a dispersal order far more seriously than taking part in an ordinary march.",
    see: ["sommations", "r644_4"],
  },
  {
    id: "sommations",
    term: "Dispersal order",
    fr: "sommations de se disperser",
    kind: "french",
    plain:
      "A police instruction telling a crowd to disperse. It is the trigger for the most serious gathering charge, and whether it was validly issued is often the real issue in a case.",
    see: ["attroupement", "sommations_regularite"],
  },
  {
    id: "sommations_regularite",
    term: "Validity of dispersal orders",
    fr: "régularité des sommations",
    kind: "french",
    plain:
      "Whether the police had the right to issue a dispersal order, in the right place, to the right people. A case can fail on this ground even if the demonstration itself was banned.",
    see: ["sommations", "nullity"],
  },
  {
    id: "gav",
    term: "Police custody",
    fr: "garde à vue (GAV)",
    kind: "french",
    plain:
      "Police questioning under arrest. It is time-limited, and it has to be reviewed by a judge. Everything that follows — charges, releases, trials — is timed from it.",
    see: ["detention", "deferement", "art_803_3"],
  },
  {
    id: "art_803_3",
    term: "Twenty-hour rule",
    fr: "article 803-3 du code de procédure pénale",
    kind: "french",
    plain:
      "Where police custody was extended without a judge's order, the detainee must be brought before a judge within 20 hours of the end of custody. If that time passes, the person must be released.",
    law: "CPP art. 803-3",
    see: ["gav", "non_saisi", "nullity"],
  },
  {
    id: "deferement",
    term: "Bringing the suspect before the prosecutor",
    fr: "défèrement",
    kind: "french",
    plain:
      "The moment the detained person is walked in front of the prosecutor, who explains the charges, hears them, and decides what to do with the case.",
    see: ["gav", "comparution_immediate", "parquet"],
  },
  {
    id: "comparution_immediate",
    term: "Same-day trial",
    fr: "comparution immédiate",
    kind: "french",
    plain:
      "A fast procedure in which an adult is brought before the criminal court the same day, or within at most three working days if a judge orders detention — and if that period passes without a hearing, the person is released.",
    french:
      "It applies to certain délits only. A defendant can ask for more time to prepare their defence, in which case the case is postponed by four to ten weeks.",
    see: ["deferement", "gav", "renvoi"],
  },
  {
    id: "renvoi",
    term: "Postponement",
    fr: "renvoi",
    kind: "french",
    plain:
      "The court putting the case back to a later date, usually so the defendant can prepare their defence.",
    see: ["comparution_immediate"],
  },
  {
    id: "crpc",
    term: "Plea procedure",
    fr: "comparution sur reconnaissance préalable de culpabilité (CRPC)",
    kind: "french",
    plain:
      "A procedure in which the person admits the facts and accepts a proposed sentence, in exchange for a lighter penalty and no trial.",
    see: ["comparution_immediate", "delai"],
  },
  {
    id: "parquet",
    term: "Prosecutor's office",
    fr: "parquet",
    kind: "french",
    plain:
      "The office that directs criminal cases: it decides which charges to bring, which procedure to use, and what sentence to request.",
    see: ["prosecutor", "darmanin"],
  },
  {
    id: "information",
    term: "Judicial investigation",
    fr: "information judiciaire",
    kind: "french",
    plain:
      "A formal investigation run by an investigating judge when the case is serious enough to need one. It is a pre-trial stage, not a trial.",
    see: ["mis_en_examen", "enquete"],
  },
  {
    id: "mis_en_examen",
    term: "Formal charge decision",
    fr: "mise en examen",
    kind: "french",
    plain:
      "The investigating judge formally charging someone. It carries constraints — such as being kept under judicial supervision — that a person charged in the ordinary way does not face.",
    see: ["information", "controle_judiciaire"],
  },
  {
    id: "non_lieu",
    term: "No further action",
    fr: "non-lieu",
    kind: "french",
    plain:
      "The decision to drop a case, either because the evidence is not sufficient or because the facts do not amount to an offence.",
    see: ["information", "classe"],
  },
  {
    id: "classe",
    term: "Case dropped without charges",
    fr: "classement sans suite",
    kind: "french",
    plain:
      "A file closed by the prosecutor without charges — because it was minor, or because there was not enough evidence, or because it was better handled another way.",
    see: ["non_lieu", "parquet"],
  },
  {
    id: "non_saisi",
    term: "Court declares itself not seized",
    fr: "non saisi",
    kind: "french",
    plain:
      "A court saying it cannot deal with the case because the person was not brought before it in time. It is a procedural failure, not an acquittal: the person is released and the case comes back later.",
    see: ["nullity", "art_803_3"],
  },
  {
    id: "mandat_depot",
    term: "Custody warrant (immediate prison)",
    fr: "mandat de dépôt",
    kind: "french",
    plain:
      "A sentence that is carried out immediately: the person is taken to prison straight from the court, rather than being released to serve the sentence later.",
    see: ["sentence", "sursis"],
  },
  {
    id: "sursis",
    term: "Suspended sentence",
    fr: "sursis",
    kind: "french",
    plain:
      "A prison sentence that is not carried out provided the person does not reoffend during the probation period.",
    see: ["sentence", "mandat_depot", "sursis_probatoire"],
  },
  {
    id: "sursis_probatoire",
    term: "Suspended sentence with probation",
    fr: "sursis probatoire",
    kind: "french",
    plain:
      "A suspended sentence with conditions to follow, such as treatment or community work, and with the prison term hanging over the person if they fail.",
    see: ["sursis"],
  },
  {
    id: "tig",
    term: "Community service sentence",
    fr: "travail d'intérêt général (TIG)",
    kind: "french",
    plain:
      "Unpaid work for the community ordered by the court, in place of prison.",
    see: ["sentence"],
  },
  {
    id: "controle_judiciaire",
    term: "Judicial supervision",
    fr: "contrôle judiciaire",
    kind: "french",
    plain:
      "A set of obligations imposed by a judge on someone under investigation, enforceable without going to prison. It can include not taking part in demonstrations in specified places.",
    french:
      "The demonstration restriction is article 138, 3° bis of the Code of procedure pénale: 'not to take part in demonstrations on the public highway in places determined by the investigating judge or the judge for liberty and detention'. It is a judicial measure, not a prefectural ban, so it is not challenged before the administrative court.",
    law: "CPP art. 138, 3° bis",
    see: ["jld", "mis_en_examen", "sentence"],
  },
  {
    id: "jld",
    term: "Judge for liberty and detention",
    fr: "juge des libertés et de la détention (JLD)",
    kind: "french",
    plain:
      "The judge who decides whether a person stays in police custody, stays in pre-trial detention, or goes out under supervision, and who reviews those decisions.",
    see: ["controle_judiciaire", "detention_provisoire"],
  },
  {
    id: "detention_provisoire",
    term: "Pre-trial detention",
    fr: "détention provisoire",
    kind: "french",
    plain:
      "Prison before any conviction, used as a preventive measure. It has to be justified and reviewed by a judge.",
    see: ["jld", "detention"],
  },
  {
    id: "pv",
    term: "Police report",
    fr: "procès-verbal (PV)",
    kind: "french",
    plain:
      "The official written record of what the police observed. It is the document charges are built on, and usually the first thing a defence lawyer reads.",
    see: ["gav", "evidence"],
  },
  {
    id: "droits_civiques",
    term: "Loss of voting and civic rights",
    fr: "privation des droits civiques",
    kind: "french",
    plain:
      "A supplementary penalty that removes civic rights such as voting or holding public office, imposed by a criminal court for certain offences such as looting.",
    french:
      "It is a penalty, so only a judge can impose it; a prosecutor may request it. The circular of 22 October asked prosecutors to request it systematically in cases of looting and violence, which is why it appears in this tracker.",
    law: "CP arts. 55-1 and 131-26",
    see: ["sentence", "circulaire", "darmanin"],
  },
  {
    id: "circulaire",
    term: "Ministry circular",
    fr: "circulaire",
    kind: "french",
    plain:
      "An internal instruction from a minister to officials under them. It is not law and cannot create an offence; it guides how prosecutors and police act.",
    see: ["darmanin", "droits_civiques"],
  },
  {
    id: "darmanin",
    term: "Justice Minister's instructions of 22 October",
    kind: "french",
    plain:
      "A circular asking prosecutors to seek harsher outcomes for people accused of violence around demonstrations, including requests to suspend voting rights and to inform employers. It is a policy instruction, not a decision that affects anyone's rights by itself.",
    see: ["circulaire", "droits_civiques", "bannissement"],
  },
  {
    id: "bannissement",
    term: "Platform ban",
    fr: "bannissement numérique",
    kind: "french",
    plain:
      "A court order preventing someone from using online platforms or accounts used for the offence. It is a judicial measure, and as a condition of judicial supervision it can last up to six months.",
    law: "CPP art. 138, 19°",
    see: ["controle_judiciaire", "darmanin"],
  },
  {
    id: "commission",
    term: "Parliamentary inquiry commission",
    fr: "commission d'enquête",
    kind: "french",
    plain:
      "A parliamentary body set up to establish facts about a matter. It produces a report, not decisions, and it cannot change any case in court.",
    see: ["parlementaire"],
  },
  {
    id: "parlementaire",
    term: "Parliamentary track",
    kind: "french",
    plain:
      "What is happening in the National Assembly or Senate. It is listed separately because it moves on a different clock from the courts and has no direct legal effect on the cases.",
    see: ["commission"],
  },
  {
    id: "abus_pouvoir",
    term: "Abuse of power",
    fr: "abus de pouvoir",
    kind: "french",
    plain:
      "Using a legal power for a purpose it was not meant for. It is a criminal offence, and it is what would have to be shown if an authority kept a ban in place after a court had ruled against it.",
    law: "CP art. 432-1 and following",
    see: ["annule", "liability"],
  },
  {
    id: "periode",
    term: "How long an order lasts",
    fr: "durée",
    kind: "french",
    plain:
      "Every order is limited in time. This is one of the most important checks in the tracker: the Conseil d'État has accepted that the circumstances justifying bans were those of 17 October, so the orders have to justify themselves as time passes.",
    see: ["couvre_feu", "periode", "proportionality"],
  },
];

const INDEX = new Map<string, GlossaryEntry>();
for (const e of GLOSSARY) INDEX.set(e.id, e);

export function glossaryById(id: string): GlossaryEntry | undefined {
  return INDEX.get(id);
}

export function glossaryByKind(kind: GlossaryKind): GlossaryEntry[] {
  return GLOSSARY.filter((e) => e.kind === kind);
}

/** Lowercase strings that should trigger a match, longest first so that
 *  "référé-liberté" wins over "référé". */
const HAYSTACKS: { entry: GlossaryEntry; needles: string[] }[] = GLOSSARY.map(
  (e) => ({
    entry: e,
    needles: [e.term, e.fr ?? "", ...(e.aliases ?? [])]
      .filter(Boolean)
      .map((s) => s.toLowerCase()),
  }),
).sort((a, b) => {
  const la = Math.max(...a.needles.map((n) => n.length));
  const lb = Math.max(...b.needles.map((n) => n.length));
  return lb - la;
});

/**
 * Find every glossary term mentioned in a piece of text.
 * Used to attach "what does this mean?" chips to each case row.
 */
export function matchTerms(text: string): GlossaryEntry[] {
  if (!text) return [];
  const hay = text.toLowerCase();
  const found = new Map<string, GlossaryEntry>();
  for (const { entry, needles } of HAYSTACKS) {
    for (const n of needles) {
      if (n.length < 4) continue;
      if (hay.includes(n)) {
        found.set(entry.id, entry);
        break;
      }
    }
  }
  return [...found.values()];
}

/** Every term mentioned in a case, for the row-level chips. */
export function termsForCase(p: {
  title: string;
  note: string;
  holding?: string;
  forum: string;
}): GlossaryEntry[] {
  const blob = [p.title, p.note, p.holding ?? "", p.forum].join(" ");
  return matchTerms(blob);
}
