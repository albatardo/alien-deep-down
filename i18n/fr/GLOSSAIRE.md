# Glossaire de traduction — Deep Down (FR)

Termes de jeu alignés sur la traduction française du système `alienrpg` (fichier `lang/fr.json`).

## Règles

| Anglais | Français |
|---|---|
| GM / Game Master | MJ / meneur de jeu |
| PC / NPC | PJ / PNJ |
| Stress, Stress Level | stress, niveau de stress (« +1 de stress ») |
| Panic Roll | test de Panique |
| Broken | Brisé |
| Critical Injury | blessure critique |
| Death save | test contre la mort |
| Slow / Fast Action | action lente / action rapide |
| Base Dice / Dam | dés de base / Dég. |
| Armor (rating) | protection |
| Power / Power Supply | Énergie / source d'énergie |
| Agenda | objectif personnel |
| Engaged / Short range / close combat | au contact / courte portée / combat rapproché |
| Strength, Agility, Wits, Empathy | FORCE, AGILITÉ, ESPRIT, EMPATHIE |
| Heavy Machinery, Stamina, Close Combat, Mobility, Ranged Combat, Piloting | MACHINES LOURDES, ENDURANCE, COMBAT RAPPROCHÉ, MOBILITÉ, COMBAT À DISTANCE, PILOTAGE |
| Command, Manipulation, Medical Aid, Observation, Survival, Comtech | COMMANDEMENT, MANIPULATION, SOINS MÉDICAUX, OBSERVATION, SURVIE, COMTECH |
| Health / Signature Item / Backstory | Santé / objet fétiche / historique |

Talents (absents de `lang/fr.json`, traductions validées) :

| Anglais | Français |
|---|---|
| Analysis | Analyse |
| Pull Rank | Faire jouer son grade |
| The Long Haul | Longue haleine |
| Field Surgeon | Chirurgien de terrain |
| Cunning | Ruse |
| Calm Breather | Souffle maîtrisé |
| Counselor | Conseiller |
| Pack Mule | Bête de somme |
| Influence, Compassion | inchangés |
| Buddy / Rival | copain / rival |

## Univers et scénario

| Anglais | Français |
|---|---|
| UPP, Weyland-Yutani, Seegson, Working Joe, United Americas | inchangés (sauf « les Amériques Unies ») |
| Ministry of Space Security (MSS) | ministère de la Sécurité spatiale (MSS) |
| Outer Rim | Bordure extérieure |
| Xenomorph / Xenoform / xenos | Xénomorphe / xénoforme / xénos |
| Hydromorph | Hydromorphe |
| Hydrohugger, Hydrobuster, facehugger, drone | inchangés |
| Long Salmon | saumon long |
| Vodyanoy | Vodianoï |
| babushka | babouchka |
| Rise or Die / Ascension or Death (acte final) | Remonter ou mourir (garder l'anglais seulement dans les noms techniques de macro/animation) |
| Surface Umbilical | ombilical de surface |
| sea walk | sortie en mer |
| drill | foreuse |
| air hose / emergency air tank | tuyau d'air / bouteille de secours |
| dive suit | combinaison de plongée |
| Baikal | Baïkal |
| mainframe | ordinateur central |
| DEKOMPRESS, SCADA, 1/VAN, PSV-Schatzi | inchangés |

## Mesures

Les distances impériales sont converties : 4 miles → 6 kilomètres.

## Coquilles corrigées de l'original

- « Dubois » → Dubov ; « Marill » → Marin Kirill (guide du MJ).
- « Karill » → Kirill (Anya, Frenkel) ; « Frenkell » → Frenkel (foreuse) ; « Xiang » → Qiang (objectif de Liu).
- Personnages - MJ : le brouillon portugais en tête de la fiche de Li Qiang (doublon de la version anglaise) est supprimé.
- Lieux : le balisage parasite copié depuis ChatGPT (page « Surveillance de l'ascenseur ») est supprimé.
- « Volkov » et « Volkoff » coexistent dans l'original : harmonisé en « Volkoff » partout.
- La station s'appelle « Novotny » presque partout, mais « Matvey » dans quelques fiches (Kim Pham, Diego Alvarez, Li Qiang, Baïkal), le dessin « Surface-Matvey » et le dossier de scènes « Base Matvey » : harmonisé en « Novotny » (dossier traduit via `i18n/fr/folders.json`). L'identifiant technique `teleportId: "Surface-Matvey"` (multilevel-tokens) est conservé.

## Noms à ne pas traduire

`scripts/init.js` (Scene Packer) cherche par leur nom anglais les journaux « Deep Down Welcome » et « Alien Map Markers » et la macro « Ligth source (token) », mais il n'est plus chargé (`esmodules` vide dans `module.json`) : ces trois noms sont traduits. Réactiver `init.js` impose de mettre ses noms à jour.

Le système alienrpg retrouve des tables par leur nom :

- les tables référencées par `system.rTables` / `system.cTables` des créatures : les tables d'attaques sont traduites (« Attaques de l'Hydrobuster », « Attaques de l'Hydromorphe », « Attaques du rôdeur, de l'éclaireur et du drone (options à ajouter) ») et `npm run build` reporte le nouveau nom sur les créatures. Les tables de blessures critiques (« Critical Injuries on Hydromorph », « Critical Injuries on Xenomorphs (add options) ») gardent leur nom : la fiche de créature ne propose que les tables dont le nom commence par « Critical Injuries ». `npm run export:docs` n'exporte pas leur nom ;
- la « Panic Table » (`game.tables.getName("Panic Table")`) : ses résultats reprennent les textes officiels `ALIENRPG.Panic*` du `lang/fr.json` du système ;
- les dossiers « Alien Creature Tables » et « Alien Mother Tables » (listes déroulantes de la fiche de créature).

## Objets et acteurs

- Les objets intégrés aux fiches d'acteurs sont traduits automatiquement quand leur texte anglais est identique à celui d'un objet du compendium : ne traduire dans `i18n/fr/actors/` que les objets qui diffèrent.
- Les notes des personnages reprennent les pages du journal « Personnages - MJ », sans l'objectif personnel.
- Hydrobuster : l'original dit « identical to HYDROBUSTER XENOMORPH » (probablement le chestburster) ; traduit tel quel.
