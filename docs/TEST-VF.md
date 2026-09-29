# Plan de test de la VF dans Foundry

Passe de validation en jeu de la traduction française d'`alien-deep-down`.
L'audit hors-ligne (couverture i18n, build des packs) est **déjà vert** : il ne
reste que ce qui ne peut se vérifier qu'avec un Foundry lancé.

## Avant de commencer

1. Lancer l'instance Docker partagée (skill `foundry-vtt-docker`) — en **https**.
2. Vérifier que `npm run build` a bien été passé après la dernière modif d'`i18n/`
   (sinon les packs servis sont périmés).
3. Fermer le monde avant tout rebuild : Foundry garde les packs LevelDB verrouillés.
4. Système `alienrpg` actif, module `alien-deep-down` activé, aventure importée.

## 1. Points à risque — à tester en priorité

Ce sont les endroits où le système alienrpg résout des documents **par leur nom**.
Une traduction mal placée les casse silencieusement : rien dans la console, juste
un menu vide ou un jet qui ne part pas.

- [ ] **Menu des tables d'attaque** — ouvrir la fiche du *Hydromorph*, du
      *Hydrobuster*, du *Hydrohugger* et du *Drone*. Le menu déroulant des tables
      doit être peuplé et la table sélectionnée doit correspondre à la créature.
- [ ] **Jet d'attaque** — déclencher le jet depuis chacune de ces fiches. Un menu
      peuplé mais un jet qui échoue signale que `system.rTables` et le nom de la
      table ont divergé.
- [ ] **Menu des blessures critiques** — il est construit en filtrant les tables
      dont le nom commence par `Critical Injuries`. Ces noms sont **volontairement
      restés en anglais** : vérifier qu'ils apparaissent bien dans le menu.
- [ ] **Dossiers système** — seul le dossier `Base Novotny` est traduit
      (`i18n/fr/folders.json`). Les dossiers `Alien Creature Tables` et
      `Alien Mother Tables` doivent rester en anglais, sinon les deux menus
      ci-dessus se vident. Vérifier qu'ils s'affichent toujours en VO.

## 2. Contenu traduit

- [ ] **Journaux** — ouvrir les 7 journaux et parcourir les pages :
      Guide d'aventure (21 p.), Lieux (40 p.), Map Markers (24 p.),
      Liste des joueurs (6 p.), Personnages MJ (9 p.), Lisez-moi (13 p.),
      Welcome (1 p.). Chercher du texte anglais résiduel et des liens internes
      cassés (un lien `@UUID` pointant vers un document renommé).
- [ ] **Page vidéo** « Message du terminal pour la capitaine Kramarenko » —
      titre traduit, mais la vidéo elle-même est en anglais
      (`terminal_upp_english.webm`). Décider si on la garde telle quelle.
- [ ] **Fiches de personnage** — PJ et PNJ : nom, apparence, agenda, relations,
      objet significatif, notes.
- [ ] **Objets** — noms et commentaires des 46 objets.
- [ ] **Scènes** — noms des scènes, textes des dessins, notes de carte, noms des
      pions. Vérifier que les téléporteurs et les automatisations (Monk's Active
      Tiles, Tagger) fonctionnent toujours : leurs noms de régions sont restés
      techniques et non traduits.
- [ ] **Playlists** — noms et descriptions. Les titres des morceaux restent en VO.

## 3. Ce qui doit rester en anglais (ne pas signaler comme bug)

- Noms de créatures : *Drone*, *Hydrobuster*, *Hydrohugger*, *Hydromorph*.
- Noms propres : Kramarenko, Dubov, Li Qiang, Alvarez, Pham, Del Campos, Frenkel…
- Noms des tables d'attaque et de blessures critiques (voir §1).
- Journal « Copyright » (21 pages) : licences audio, texte légal.
- Titres des morceaux de musique.
- Mots identiques dans les deux langues : Combat, Suspense, Hangar, Influence,
  Compassion, Batteries, Vodka.

## 4. Après le test

Consigner les corrections dans `i18n/fr/`, **jamais** dans `packs/` ni `src/`,
puis relancer `npm run build` monde fermé.

---

# Résultats — passe du 2026-09-22

Monde `deep-down-fr-recette`, Foundry v14.367, système alienrpg 4.0.6.
Vérifications menées par script (Playwright + API Foundry).

## §1 Points à risque — tous verts

- Dossiers `Alien Creature Tables` et `Alien Mother Tables` présents et en VO ;
  `Base Novotny` bien traduit.
- Menu des tables d'attaque peuplé (5 entrées), menu des blessures critiques
  peuplé (2 entrées) : le préfixe `Critical Injuries` a été préservé.
- Les 7 créatures résolvent leurs tables : `Drone`, `Hydrobuster`,
  `Hydrohugger`, `Hydromorphe` → `game.tables.getName()` renvoie bien la table.
- Cas `Attaques du Hydrohugger` : cette table **est** traduite, mais aucun
  acteur ne la référence (`rTables: "None"` déjà dans la source anglaise),
  donc rien n'est cassé.

## §2 Contenu — vert

- 9 journaux, 136 pages : **0 lien cassé**, 0 `@UUID` non enrichi, 0 formule
  de dés non parsée.
- 25 scènes, 30 régions, 30 comportements : **0 téléport cassé**.

## Défaut trouvé — amont, pas la VF

9 notes de carte, réparties sur 8 scènes (`Accès et ombilical`, `EXTÉRIEUR`,
`FOND MARIN`, `Fin`, `Fin (station Korab)`, `Vaisseau écrasé`,
`carte complète`), pointent toutes vers `JournalEntry.WmgzHFNduuw3OlM2`, qui
n'existe ni dans le monde ni dans aucun compendium.

Ce n'est **pas** une régression de traduction : `entryId` n'est pas un champ
traduit, et l'id est déjà référencé tel quel dans `src/maps/` côté anglais.
Le journal n'a jamais été exporté depuis le monde de l'auteur. À remonter au
dépôt d'origine.

**Corrigé le 29/09/2026** : leurs `pageId` désignent toutes des pages du
journal « Deep Down Read Me » (`clygnLPo7hsxF4NK`), dont l'id a changé à
l'export. Les patchs `i18n/fr/maps/` redirigent `entryId` vers ce journal ;
vérifié en jeu, chaque note ouvre la bonne page. Restent deux notes sans
page ni journal existants, irrécupérables : `Accès et ombilical`
(`Zcx2co83x466zjwl`) et `EXTÉRIEUR` (`ps7QAUV15eFjq992`).

## Reste à faire à la main

La vidéo `terminal_upp_english.webm` de la page « Message du terminal pour la
capitaine Kramarenko » reste en anglais ; sa transcription française est à la fin
de la page « Résumé de l'histoire » du guide d'aventure (29/09/2026).
