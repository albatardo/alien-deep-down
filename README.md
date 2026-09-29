# Deep Down — version française

Traduction française du module **Deep Down** pour le système **Alien RPG** de Foundry VTT.

- Aventure : Erich « Jack Sands » ([jacksands/alien-deep-down](https://github.com/jacksands/alien-deep-down)), d'après le scénario cinématique *Dead Sea* d'Alex Aguila.
- Traduction française : Quentin Eluard.

La présentation d'origine (en anglais) suit cette section.

## Installation

Dans Foundry, **Modules additionnels → Installer un module**, puis collez ce manifeste :

```text
https://raw.githubusercontent.com/albatardo/alien-deep-down/refs/heads/main/module.json
```

Le module garde l'identifiant `alien-deep-down` : il **remplace** la version anglaise si elle est installée. Le reste (monde Alien RPG, modules requis, import de l'aventure) est identique à la version d'origine, décrit plus bas.

## Ce qui est traduit

Tout le contenu des compendiums, dans le compendium lui-même et dans l'aventure importable : journaux, acteurs et objets intégrés à leurs fiches, objets, tables aléatoires, scènes (noms, textes sur les cartes, pions), playlists, présentation de l'aventure.

Restent volontairement en anglais :

- les noms que le système Alien RPG cherche par leur nom exact : les tables d'attaque et de blessures critiques des créatures, la « Panic Table » (ses résultats reprennent les textes officiels français du système) et les quatre dossiers de tables (« Alien Tables », « Alien Creature Tables », « Alien Mother Tables », « Alien Sub-Tables ») ;
- le journal « Copyright », les noms des macros d'effets visuels et les titres des musiques.

L'interface de Foundry et du système n'est pas fournie par ce module : elle suit la langue choisie dans Foundry. Le système Alien RPG est livré avec le français, mais pas Foundry lui-même : pour avoir ses menus en français, installez le module communautaire de traduction française du cœur de Foundry, puis choisissez « Français » comme langue dans la configuration de Foundry.

Les choix de vocabulaire et les coquilles corrigées de l'original sont recensés dans [i18n/fr/GLOSSAIRE.md](i18n/fr/GLOSSAIRE.md).

## Contribuer à la traduction

Les compendiums (`packs/`, au format LevelDB) sont générés : on ne les modifie jamais à la main. Les sources anglaises sont dans `src/` (JSON) et les traductions dans `i18n/fr/`.

Prérequis : Node.js 20.11 ou plus, puis `npm install`.

| Commande | Rôle |
|---|---|
| `npm run unpack` | Extrait `packs/` vers `src/` (à relancer après une mise à jour du module d'origine). |
| `npm run export:journal -- "<nom du journal>" <dossier>` | Crée `i18n/fr/journal/<dossier>/` : un fichier HTML par page et un `meta.json` (noms). |
| `npm run export:docs -- <pack>` | Crée un JSON par document dans `i18n/fr/<pack>/` (`actors`, `items`, `rolltables`, `maps`, `playlists`, `macros` ou `adventure`), avec seulement les champs à traduire. |
| `npm run build` | Applique `i18n/fr/` aux sources et recompile `packs/`. |

Les exports n'écrasent jamais un fichier existant : on traduit directement dans le squelette généré, en remplaçant le texte anglais par le français. Les traductions sont appliquées par `_id`, au compendium comme à l'aventure. Les objets intégrés aux fiches d'acteurs reprennent automatiquement la traduction de l'objet du compendium qui a le même texte anglais. Les noms de dossiers se traduisent dans `i18n/fr/folders.json`.

**Avant `npm run build`, fermez le monde dans Foundry** (ou désactivez le module) : Foundry verrouille les compendiums ouverts.

---

# **Welcome to Deep Down**

 ![DEEP_DOWN_ART](https://github.com/user-attachments/assets/fcc97561-8c70-496f-9594-c7f8048317ec)
<br> 
<br> 
<br>
Deep Down, a gripping underwater horror adventure.

Set in the deeps of the on the mysterious ocean planet Voda, a team must the chaos of an isolated research station teetering on the edge of collapse. Tensions run high after a diver desapearence, and the unforgiving deep reveals threats far beyond the limits of human understanding.


<br>
This is my first attempt at sharing an adventure with the community, and I sincerely hope you enjoy it!
<br> 
<br>
For those who wish to support me, I’ve included a “buy me a coffee” link.
<br> 
<br>
Perhaps next time I can use some proper AI subscriptions instead of suffering through the free tier, LOL!!!
<br> 
<br>
Thank you in advance for your generosity!https://buymeacoffee.com/jack_sands
<br> 
<br>
<br> 
<br>
<img src="https://github.com/user-attachments/assets/778cd93f-cd4b-43df-9b76-83e4aff81dad" width="150" />


<br> 
<br>
Jack Sands is an old RPG character close to my heart, and I use his name as my online alias. I still find it hilarious when people call me Jack because they remember his name more than mine even to this day.
<br> 
<br>




# **DEAD SEA**
<br> 
<br>


**Deep Down** is a variation of the amazing cinematic scenario **Dead Sea**, created by **Alex Aguila**, who most generously allowed me to publish this adaptation.
<br> 
<br>
<img src="https://github.com/user-attachments/assets/83d860fe-a44e-4207-a277-1b811979862b" width="300" />

 

Please check out the original DEAD SEA!! You’ll find a PDF included in the assets/documents folder, and a link to the site where updated versions are available:
<br> 
<br>
 

https://www.victoryconditiongaming.com/2021/02/alien-rpg-dead-sea-cinematic-scenario.html
<br> 
<br>






# **About Deep Down**
<br> 
<br>
After running the Colonial Marines campaign—which my players absolutely loved—despite having zero prior experience with the Alien RPG, I decided to take on a cinematic scenario. I was already set on using Dead Sea, but my players were eager to face the Xenos, so I made some adjustments!
<br> 
<br>

It was a blast! I've run it several times now, receiving great feedback, so I decided to share it!Now I'm making a joke with the directions. First, DEEP DOWN, and now they're playing CRAWLING UP!—a mini-campaign on its 8 sessions and not even half way. Next will be RUNNI... oops, they don't know that yet! 😉
<br> 
<br>
A small teaser of my Deep Down Adventure for Alien RPG in Foundry VTT:
[https://www.youtube.com/watch?v=cCVT71oekfI](https://youtu.be/v0vvAQuHKZs)
<br> 
<br>



# **Key Changes in Deep Down**
<br> 
<br>


The most notable change in Deep Down is the introduction of a form of xenomorph. My players specifically wanted to face the “de facto” protagonist! But I like surprises!Another significant difference is the map, which I created using my own assets for the VTT, forcing me to accommodate for what I had.
<br> 
<br>


# **Copyright and AI generation**
<br> 
<br>


I’ve removed any copyrighted material.
<br> 
<br>



As a result, some items and tables will need to be completed by the GM.
<br> 
<br>

Additionally, much of the content was generated using free AI tools, such as Leonardo AI and Microsoft Image Generator.
<br> 
<br>

I had use ChatGPT for translation, I'm from Brazil and wrote all these im portuguese.
<br> 
<br>

There is also a selection of amazing copyright-free music, with attribution and notes provided in the designated journal.
<br> 
<br>
<br> 
<br>
<br> 
<br>


# **Installation**
<br>

Search for the module in the Foundry module browser once it becomes available.
<br> 
<br>
<br>
<br> 
Alternatively, Copy the manifest URL below and paste it into the module installation field:
<br>
<br> 

'https://raw.githubusercontent.com/jacksands/alien-deep-down/refs/heads/main/module.json'
<br>
<br> 
<img src="https://github.com/user-attachments/assets/2879dc44-a8c2-414a-bd1c-8d71c12b9a22" height="300" />
<br>
<br> 

# **Setting Up the World**
<br>
<br> 
Create a new WORLD in Foundry with any name you like and select the ALIEN RPG SYSTEM.
<br>
<br> 
Start the world as usual, then import any necessary assets from the system.
<br>
<br> 
Navigate to:
<br>
<br> 
SETTINGS → MANAGE MODULES
<br>
<br> 
Activate DEEP DOWN. (Some modules are required or recommended—see details below.)
<br>
<br> 

# **Importing the Adventure**

<br>
<br> 
After activating the module:
<br>
<br> 
Go to COMPENDIUM → DEEP DOWN ADVENTURE.
<br>
<br> 
Import the adventure into your game.
<br>
<br> 
<img src="https://github.com/user-attachments/assets/cdf66842-c6ad-4611-9010-e9ed230a0bbd" height="300" />
<br>
<br> 
<br> 
<br>
<br> 

# **Thank you** 
<br>
<br> 
Thank you for taking the time to explore Deep Down. I’d love to hear your feedback, you can find me at the Alien RPG by Free League wasting everyone’s time! 
<br>
<br> 
Please If you come across any copyrighted material that I may have overlooked, kindly let me know, and I will promptly remove it.

 

# **MODULES**
<br>
<br> 
REQUIRED:
<br>
<br>
FX MASTER  -  The only one that can create these beautiful effects on the scene, especially underwater. The native weather in Foundry just can't achieve this!
<br>
<br> 
MONK ACTIVE TILES TRIGGER  -  Helps a lot with automations! You can live without it, but trust me, it’s a sad life.
<br>
<br> 
TAGGER  -  Needed for the MONK module to work properly.
<br>
<br> 
<br>
<br> 
SUGGESTED:
<br>
<br> 
Easy Regions  -  Enhances the text when teleporting tokens, making it much smoother.
<br>
<br> 
Journal Scaler  -  If you have vision impairments, this will help a lot.
<br>
<br> 
MONK SCENE NAVIGATION  -  Helps with scene organization, keeping things neat.
<br>
<br> 
TOKEN MAGIC FX  -  Why FX? Well... it’s pretty!
<br>
<br> 
Share Media  -  The best way to show media to your players!
<br>
<br> 
Token Variant Art  -  This takes time to configure, but helps with tokens that have multiple images, which is great for immersion.
<br>
<br> 
<br>
<br> 
A last-minute suggestion:
<br>
<br> 
Use Lock View to fix some scenes if you have the time. All intros and the rise and fall should be pre-configured, but I think the GM should also activate it in the module settings. Since I can't automate this, I leave it as a suggestion.Library: Scene PackerIf you make all this and the module breaks, or journal links break, this solves that kind of problem and brings some automation. Take a look at its README!I'm trying to remove this requirement since it is braking the music configuration for scenes.

 

 

 

 
