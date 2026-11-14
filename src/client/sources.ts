export interface SourceLink {
  key: string;
  label: string;
  url: string;
}

export const SOURCES: SourceLink[] = [
  /* Hérault — dossier d'origine */
  {
    key: "orta2608431",
    label: "ORTA 2608431, 23 oct. 2026",
    url: "https://librejustice.fr/decision/fr/elaICbiQqZBq",
  },
  {
    key: "orta2608432",
    label: "ORTA 2608432, 23 oct. 2026 (open data)",
    url: "https://opendata.justice-administrative.fr/recherche/shareFile/TA34/ORTA_2608432_20261023",
  },
  {
    key: "orta2608433",
    label: "ORTA 2608433, 23 oct. 2026",
    url: "https://librejustice.fr/decision/fr/baDEEt1qEI8j",
  },
  {
    key: "orta2608452",
    label: "ORTA 2608452, 23 oct. 2026",
    url: "https://librejustice.fr/decision/fr/9EEYnYc2GqQ7",
  },
  {
    key: "orta2608653",
    label: "ORTA 2608653, 31 oct. 2026",
    url: "https://www.justiweb.fr/ta/TA34_ORTA_2608653_20261031",
  },
  {
    key: "ce520786",
    label: "CE 520786, 24 oct. 2026 (Ariane)",
    url: "https://www.conseil-etat.fr/fr/arianeweb/CE/decision/2026-10-24/520786",
  },
  {
    key: "legifrance520786",
    label: "CE 520786 — Légifrance",
    url: "https://www.legifrance.gouv.fr/ceta/id/CETATEXT000055019840",
  },
  {
    key: "ce520381",
    label: "CE 520381, 15 oct. 2026 (Ariane)",
    url: "https://www.conseil-etat.fr/fr/arianeweb/CE/decision/2026-10-15/520381",
  },
  {
    key: "legifrance520381",
    label: "CE 520381 — Légifrance",
    url: "https://www.legifrance.gouv.fr/ceta/id/CETATEXT000054993149",
  },
  {
    key: "opendataTA34",
    label: "Open data — TA Montpellier",
    url: "https://opendata.justice-administrative.fr/recherche/api/model_search_date_juri/openData/Date_Lecture/manifestation/TA34/2026-10-01/2026-11-11/100",
  },
  {
    key: "opendataCAA34",
    label: "Open data — CAA Montpellier",
    url: "https://opendata.justice-administrative.fr/recherche/api/model_search_date_juri/openData/Date_Lecture/manifestation/CAA34/2026-09-01/2026-11-11/100",
  },
  {
    key: "pref34",
    label: "Préfecture de l'Hérault — communiqués",
    url: "https://www.herault.gouv.fr/",
  },
  {
    key: "melun",
    label: "TA Melun, 20 déc. 2024",
    url: "https://www.legifrance.gouv.fr/ceta/",
  },

  /* Conseil d'État — cadre national */
  {
    key: "ce520729",
    label: "CE 520729, 23 oct. 2026 (Ariane)",
    url: "https://www.conseil-etat.fr/fr/arianeweb/CE/decision/2026-10-23/520729",
  },
  {
    key: "leparisienCE",
    label:
      "Le Parisien — CE rejette les recours contre les déclarations présidentielles, 23 oct. 2026",
    url: "https://www.leparisien.fr/politique/le-conseil-detat-rejette-les-recours-sur-les-interdictions-generalisees-de-manifester-demandees-par-emmanuel-macron-24-10-2026-QE633TO7UNHWFA4W2BIFYWF2GY.php",
  },
  {
    key: "ce521001",
    label: "CE 521001, 31 oct. 2026 (Ariane)",
    url: "https://www.conseil-etat.fr/fr/arianeweb/CE/decision/2026-10-31/521001",
  },
  {
    key: "humanite31",
    label: "L'Humanité — le CE annule la décision du TA, 31 oct. 2026",
    url: "https://www.humanite.fr/politique/manifestations/manifestations-du-31-octobre-la-prefecture-de-paris-interdit-les-parcours-deposes-par-lintersyndicale-et-des-gilets-jaunes-le-tribunal-administratif-saisi-en-refere",
  },

  /* Décisions administratives — 24 octobre */
  {
    key: "leparisienJuri",
    label:
      "Le Parisien — la justice valide ou invalide les interdictions, 24 oct. 2026",
    url: "https://www.leparisien.fr/politique/mobilisation-du-24-octobre-paris-lyon-marseille-bordeaux-la-justice-valide-ou-invalide-les-interdictions-de-manifester-24-10-2026-GKJFVNJAYBAU5E4KD3KDORDOGM.php",
  },
  {
    key: "sudouestBordeaux",
    label:
      "Sud Ouest — why the unions failed to censor the Bordeaux order, 24 oct. 2026",
    url: "https://www.sudouest.fr/gironde/bordeaux/mobilisation-du-24-octobre-pourquoi-les-syndicats-n-ont-pas-reussi-a-censurer-le-decret-de-la-prefete-sur-la-manifestation-a-bordeaux-31224161.php",
  },
  {
    key: "ouestFranceRennes",
    label: "Ouest France — TA Rennes rejects the Rennes ban, 24 oct. 2026",
    url: "https://www.ouest-france.fr/societe/manifestation/le-tribunal-administratif-rejette-le-recours-contre-linterdiction-de-manifester-dans-le-centre-de-rennes-ce-samedi-0f1e677a-cf97-11f1-95ba-26d2045f6620",
  },
  {
    key: "ouestFranceCaen",
    label:
      "Ouest France — recours contre l'interdiction de Caen rejeté, 24 oct. 2026",
    url: "https://www.ouest-france.fr/societe/manifestation/mobilisation-du-24-octobre-le-recours-contre-linterdiction-de-manifester-en-centre-ville-de-caen-est-rejete-5a955e8e-cf7e-11f1-95ba-26d2045f6620",
  },
  {
    key: "iciLimoges",
    label:
      "ICI — arrêtés de couvre-feu et d'interdiction retoqués à Limoges, 24 oct. 2026",
    url: "https://www.ici.fr/nouvelle-aquitaine/haute-vienne-87/limoges/info-ici-limousin-le-couvre-feu-et-l-interdiction-de-manifester-a-limoges-retoques-par-la-justice-administrative-6098325",
  },
  {
    key: "ledauphineGap",
    label: "Le Dauphiné — l'arrêté de Gap est suspendu, 24 oct. 2026",
    url: "https://www.ledauphine.com/social/2026/10/24/l-arrete-du-prefet-interdisant-les-manifestations-dans-le-centre-ville-de-gap-est-suspendu",
  },
  {
    key: "lindependantPerpignan",
    label:
      "L'Indépendant — justice confirme le couvre-feu et l'interdiction à Perpignan, 23 oct. 2026",
    url: "https://www.lindependant.fr/2026/10/23/mobilisation-du-24-octobre-la-justice-confirme-la-mise-en-place-dun-couvre-feu-pour-les-mineurs-et-linterdiction-de-manifester-en-centre-ville-de-13617045.php",
  },
  {
    key: "semainePyrenees",
    label: "La Semaine des Pyrénées — le TA valide l'interdiction de Tarbes",
    url: "https://www.lasemainedespyrenees.fr/tarbes-pourquoi-le-tribunal-administratif-a-valide-linterdiction-de-manifestation-du-24-octobre-du-collectif-soulevement-des-coleres-convergence-des-luttes/",
  },
  {
    key: "laprovenceMarseille",
    label:
      "La Provence — interdiction et couvre-feu de Marseille attaqués au TA, 22 oct. 2026",
    url: "https://www.laprovence.com/article/politique/1022895838693414/interdiction-de-manifester-et-couvre-feu-a-marseille-les-arretes-prefectoraux-attaques-au-tribunal-administratif",
  },

  /* Décisions administratives — 31 octobre et suivantes */
  {
    key: "iciBesancon",
    label: "ICI — TA Besançon entérine l'interdiction du tracé, 31 oct. 2026",
    url: "https://www.ici.fr/bourgogne-franche-comte/doubs-25/besancon/besancon-l-interdiction-du-trace-de-manifestation-par-la-prefecture-confirmee-par-le-tribunal-administratif-5697727",
  },
  {
    key: "lemondeParis31",
    label:
      "Le Monde — le TA Paris suspend l'arrêté sur Bastille–Nation, 30 oct. 2026",
    url: "https://www.lemonde.fr/societe/article/2026/10/30/manifestation-du-31-octobre-a-paris-le-tribunal-administratif-suspend-l-arrete-de-la-prefecture-de-police-interdisant-la-manifestation-entre-bastille-et-nation-souhaite-par-l-intersyndicale_6803066_3225.html",
  },
  {
    key: "leparisienParis31",
    label: "Le Parisien — le parcours autorisé par le TA, 30 oct. 2026",
    url: "https://www.leparisien.fr/paris-75/manifestation-du-31-octobre-a-paris-bastille-nation-voici-le-parcours-autorise-par-le-tribunal-administratif-30-10-2026-VHV7WTYF3FDVFOJUDLHZFG5QZQ.php",
  },
  {
    key: "lefigaroParis5",
    label:
      "Le Figaro — le parcours République–Nation validé par le TA, 4 nov. 2026",
    url: "https://www.lefigaro.fr/actualite-france/manifestation-5-novembre-greve-mobilisation-etudiants-syndicats-et-gilets-jaunes-en-lutte-contre-la-vie-chere-20261104",
  },
  {
    key: "revolutionPermanente",
    label:
      "Révolution permanente — le TA annule l'interdiction du parcours Bastille–Pitié, 10 nov. 2026",
    url: "https://www.revolutionpermanente.fr/Interdiction-de-manifester-annulee-revers-pour-la-prefecture-victoire-de-la-determination-etudiante?amp=1",
  },
  {
    key: "actuToulouse",
    label:
      "Actu.fr — la justice donne raison au préfet de Toulouse, 5 nov. 2026",
    url: "https://actu.fr/occitanie/toulouse_31555/manifestation-du-5-novembre-la-justice-donne-raison-au-prefet-qui-a-interdit-le-cortege-en-centre-ville-de-toulouse_65016680.html",
  },
  {
    key: "taNancy7",
    label:
      "TA Nancy — équipements de protection autorisés pour les street medics (ord. 2604074, 7 nov. 2026)",
    url: "https://nancy.tribunal-administratif.fr/decisions-de-justice/dernieres-decisions/manifestation-du-7-novembre-2026-les-equipements-de-protection-individuelle-autorises-pour-les-street-medics",
  },
  {
    key: "infosMediaNantes",
    label:
      "Infos Média — TA Nancy : exceptions pour les street medics, 8 nov. 2026",
    url: "https://infos-media-nantes.fr/?p=35053",
  },
  {
    key: "lnrToursReferes",
    label:
      "La Nouvelle République — deux référés contre l'interdiction de Tours, 30 oct. 2026",
    url: "https://www.lanouvellerepublique.fr/tours/des-mesures-disproportionnees-deux-referes-deposes-ce-vendredi-30-octobre-contre-linterdiction-de-manifester-a-tours-1793359634",
  },
  {
    key: "lnrToursCouvreFeu",
    label:
      "La Nouvelle République — couvre-feu en centre-ville de Tours, 31 oct. 2026",
    url: "https://www.lanouvellerepublique.fr/tours/manifestation-du-31-octobre-un-couvre-feu-a-tours-pour-prevenir-les-violences-1793387767",
  },
  {
    key: "placeGrenoble",
    label:
      "Place Grenet — interdiction de GAME et couvre-feu à Grenoble, 23 oct. 2026",
    url: "https://www.placegrenet.fr/2026/10/23/grenoble-interdiction-de-manifester-dans-plusieurs-secteurs-du-centre-ville-samedi-et-un-couvre-feu-le-soir/692508",
  },
  {
    key: "laprovenceAvignon",
    label: "La Provence — centre d'Avignon interdit, 31 oct. 2026",
    url: "https://www.laprovence.com/article/faits-divers-justice/3097267193222714/mobilisation-du-31-octobre-les-manifestations-encore-interdites-dans-le-centre-ville-davignon",
  },
  {
    key: "lyonCapitale",
    label:
      "Lyon Capitale — référé contre l'interdiction de Bellecour, 4 nov. 2026",
    url: "https://www.lyoncapitale.fr/actualite/manifestation-du-5-novembre-a-lyon-lintersyndicale-attaque-linterdiction-du-parcours-jusqua-bellecour-en-justice",
  },
  {
    key: "larepOrleans",
    label:
      "La République — la préfecture interdit la manifestation antifasciste d'Orléans, 22 oct. 2026",
    url: "https://www.larep.fr/orleans-45000/actualites/je-suis-furieux-la-prefecture-interdit-la-manifestation-antifasciste-du-dimanche-25-octobre-a-orleans_15067514/",
  },
  {
    key: "leparisienOrleans",
    label:
      "Le Parisien — manifestation interdite à Orléans dimanche, 22 oct. 2026",
    url: "https://www.leparisien.fr/politique/securite-du-meeting-rn-il-sera-interdit-de-manifester-a-orleans-dimanche-22-10-2026-AZ2LZWSVFVCHJDVM5QEQ5F7PUY.php",
  },
  {
    key: "sudouestYvelines",
    label:
      "Sud Ouest — deux événements d'extrême droite radicale interdits, 29 oct. 2026",
    url: "https://www.sudouest.fr/ile-de-france/paris/attentat-dans-les-yvelines-dans-un-climat-politique-tendu-les-autorites-interdisent-deux-evenements-de-l-extreme-droite-radicale-31292199.php",
  },
  {
    key: "lnrCouvreFeu",
    label:
      "La Nouvelle République — couvre-feu à Paris reconduit, 22 oct. 2026",
    url: "https://www.lanouvellerepublique.fr/a-la-une/direct-violences-du-17-octobre-sebastien-lecornu-recoit-les-partis-a-matignon-les-services-de-renseignement-convoques-a-l-elysee-1792648762",
  },

  /* Pénal */
  {
    key: "20minutesParis",
    label:
      "20 Minutes — le point sur les interpellations à Paris, 21 oct. 2026",
    url: "https://www.20minutes.fr/societe/4256254-20261021-violences-17-octobre-78-majeurs-4-condamnations-prison-ferme-point-interpellations-paris",
  },
  {
    key: "lemondeCI",
    label: "Le Monde — comparutions immédiates du 17 octobre, 21 oct. 2026",
    url: "https://www.lemonde.fr/societe/article/2026/10/21/violences-du-17-octobre-aux-comparutions-immediates-des-procedures-fragiles-et-des-juges-sous-pression_6798201_3224.html",
  },
  {
    key: "lemondeDirect",
    label:
      "Le Monde — direct : 2 500 gardes à vue et 174 incarcérations, 24 oct. 2026",
    url: "https://www.lemonde.fr/societe/live/2026/10/24/en-direct-manifestations-du-24-octobre-la-menace-reste-elevee-estime-sebastien-lecornu-en-ciblant-l-ultragauche-et-la-delinquance_6795855_3224.html",
  },
  {
    key: "nouvelObsCI",
    label:
      "Nouvel Obs — les premières condamnations au tribunal de Paris, 20 oct. 2026",
    url: "https://www.nouvelobs.com/justice/20261020.OBS119359/c-est-un-immense-gachis-au-tribunal-de-paris-les-premieres-condamnations-tombent-apres-la-mobilisation-du-17-octobre.html",
  },
  {
    key: "sudouestNice",
    label:
      "Sud Ouest — procès de dix militants présumés d'ultradroite reporté au 26 nov. 2026",
    url: "https://www.sudouest.fr/societe/greves-et-manifestations/manifestation-du-24-octobre-le-proces-de-dix-militants-presumes-d-ultradroite-a-nice-reporte-au-26-novembre-31266879.php",
  },
  {
    key: "ouestFranceNantes",
    label:
      "Ouest France — prévenus interdits de manifester après le 24 oct. 2026",
    url: "https://www.ouest-france.fr/societe/faits-divers/jaimerais-continuer-a-manifester-des-prevenus-interdits-de-manifestation-apres-les-violences-du-24-octobre-f95cbde4-d160-11f1-95ba-26d2045f6620",
  },
  {
    key: "ouestFranceBrest",
    label:
      "Ouest France — les photos de lycéens saisies sont liées aux faits du 17 oct., 12 nov. 2026",
    url: "https://www.ouest-france.fr/bretagne/brest-29200/les-photos-de-lyceens-requisitionnees-sont-en-lien-avec-les-faits-graves-du-17-octobre-devoile-le-parquet-de-brest-f5ccbb96-de7d-11f1-a62b-776e3051b0df",
  },
  {
    key: "macommuneBelfort",
    label: "Ma Commune — deux jeunes condamnés à Belfort",
    url: "https://www.macommune.info/manifestations-lyceennes-deux-jeunes-condamnes-pour-des-violences-contre-les-forces-de-lordre-a-belfort/",
  },
  {
    key: "ledauphineDrome",
    label: "Le Dauphiné — 21 interpellations en Drôme-Ardèche, 24 oct. 2026",
    url: "https://www.ledauphine.com/social/2026/10/24/mobilisation-du-24-octobre-des-rassemblements-malgre-les-interdictions-prefectorales",
  },
  {
    key: "france3Montpellier5",
    label:
      "France 3 Occitanie — manifestation du 5 nov. à Montpellier (page désormais en 404)",
    url: "https://france3-regions.franceinfo.fr/occitanie/herault/montpellier/direct-manifestation-du-5-novembre-parcours-defile-transports-perturbes-ecoles-fermees-lycees-et-facs-bloques-suivez-les-mobilisations-a-montpellier-perpignan-nimes-et-beziers-3444693.html",
  },
  {
    key: "liberationCirculaire",
    label: "Libération — Darmanin et les droits civiques, 22 oct. 2026",
    url: "https://www.liberation.fr/societe/police-justice/manifestations-du-17-octobre-toujours-plus-ferme-gerald-darmanin-appelle-les-procureurs-a-requerir-des-suspensions-du-droit-de-vote-20261022_SVO5PEN47BCBFM5FXWTET4MGXI/",
  },
  {
    key: "leparisienCirculaire",
    label:
      "Le Parisien — durcissement des réquisitions contre les auteurs de violences urbaines, 22 oct. 2026",
    url: "https://www.leparisien.fr/politique/droit-de-vote-information-des-employeurs-darmanin-demande-un-durcissement-des-requisitions-contre-les-auteurs-de-violences-urbaines-22-10-2026-3QLIFE33PBAVDNI67NGZ4GRWZ4.php",
  },
  {
    key: "humaniteCirculaire",
    label:
      "L'Humanité — analyse critique de la circulaire Darmanin, 23 oct. 2026",
    url: "https://www.humanite.fr/politique/gerald-darmanin/information-aux-employeurs-privation-du-droit-de-vote-bannissement-numerique-comment-avec-sa-circulaire-gerald-darmanin-devale-la-pente-ultra-autoritaire",
  },

  /* Mobilisations en cours */
  {
    key: "france2414",
    label: "France 24 — ce qu'il faut savoir pour le 14 nov. 2026",
    url: "https://www.france24.com/fr/france/20261113-manifestations-du-14-novembre-parcours-revendications-s%C3%A9curit%C3%A9-ce-qu-il-faut-savoir",
  },
  {
    key: "france24Antiterrorisme",
    label:
      "France 24 — l'arsenal antiterroriste utilisé contre les manifestants, 13 nov. 2026",
    url: "https://www.france24.com/fr/france/20261113-col%C3%A8re-sociale-l-arsenal-antiterroriste-n%C3%A9-des-attentats-de-2015-utilis%C3%A9-contre-les-manifestants",
  },
  {
    key: "sudouestPeinture",
    label: "Sud Ouest — mobilisation du 31 oct. et 5 nov., 30 oct. 2026",
    url: "https://www.ouest-france.fr/societe/manifestation/manifestations-du-31-octobre-et-5-novembre-la-cgt-refuse-par-avance-toute-interdiction-de-manifester-par-arrete-cd18a6d8-d446-11f1-84f3-5611f158a658",
  },
  {
    key: "vertEcoLegal",
    label:
      "Vert.eco — interdiction, couvre-feu, suspension du droit de vote : que dit la loi ?",
    url: "https://vert.eco/rapports-de-force/manifestations-interdites-couvre-feu-suspension-du-droit-de-vote-tout-cela-est-il-bien-legal/",
  },
];
