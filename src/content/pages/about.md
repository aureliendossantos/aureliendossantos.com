---
title: Qui suis-je ?
toc: true
palette: whiteboard
layout: "$layouts/Future.astro"
---

Je m'appelle <em>Aurélien Dos Santos</em>, j'ai <em class="hover:text-[#4a8bf3]/80" title="Né le 22 janvier 1997 !"><span id="age">25</span> ans</em> et je vis à <em>Toulouse</em>.

👋 Je suis à la recherche d'un emploi ! Pour plus d'informations, rendez-vous sur la page de [mes expériences pro](/pro).

## Mes projets

Mes projets les plus récents :

- [QRPG](https://youtu.be/TE4jHjvZ1Nk?t=17), un hybride entre jeu vidéo et jeu de société ;
- [FaireDesJeux.fr](https://fairedesjeux.fr/), un site collaboratif de formations à la création de jeux ;
- Un [jeu de survie](https://survie.aureliendossantos.com/) sur navigateur où les joueurs doivent survivre sur une île déserte et collaborer en asynchrone ;
- La chaîne YouTube de Game Dev Alliance, sur laquelle nous publions des vidéos d'actualité autour du développement de jeux, des tutoriels et des cours théoriques.
- Ce site web : [à propos](/website).

Voici quelques projets terminés ou mis de côté :

- [Grimoire Explorer](https://grimoire.aureliendossantos.com), une appli web permettant de consulter les cartes de Grimoire du jeu Destiny via son API ;
- [Mes jeux sur itch.io](https://aureliendossantos.itch.io), dont notamment :
  - [PowerUp!](https://aureliendossantos.itch.io/powerup), un prototype de jeu éducatif sur le thème de la transition énergétique ;
  - [New Miami 2080](https://aureliendossantos.itch.io/new-miami-2080), un shoot'em up réalisé en une semaine sur PICO-8 ;
  - [Il faut sauver Sosthène IV](https://aureliendossantos.itch.io/sostheneiv) et [Après la pluie](https://aureliendossantos.itch.io/apreslapluie), deux jeux réalisés sur RPG Maker en un week-end chacun et mettant l'accent sur la narration ;
  - [𝔩𝔢 𝔡𝔢𝔩𝔦𝔯𝔢](https://gamedevalliance.itch.io/delire) (le delire), un cadavre exquis, ou jeu multi-maker, dans lequel chaque créateur avait 20 minutes pour réaliser sa partie.
- Projets de Game Dev Alliance :
  - Le [wiki de la création de jeux](https://wiki.gamedevalliance.fr/), que j'ai principalement alimenté en informations à l'époque où il était dédié à RPG Maker. Nous l'avons ensuite ouvert à tous les moteurs, sans atteindre le même niveau d'intérêt.
  - Le forum de Game Dev Alliance, ouvert de mars 2018 à avril 2019 ([archive](https://web.archive.org/web/20190401141448/http://gamedevalliance.fr/)), dédié à l'entraide, aux projets des membres et aux discussions générales.
  - Organisation et animation de plusieurs [game jams](https://gamedevalliance.itch.io/).
  - [RPG Maker Starter Pack](https://gamedevalliance.itch.io/starterpack), un projet d'exemple collaboratif sur RPG Maker destiné aux débutants, regroupant de nombreux décors réutilisables ainsi des astuces de programmation et de mise en scène.

## Historique de mes positions

Je suis né en région parisienne d'une mère bretonne et d'un père portugais. Très jeune, ma famille a déménagé dans les Landes pour mieux accueillir ma petite sœur. J'ai vécu dans des appartements étudiants à Pau pour suivre mes premières études, puis j'ai déménagé à Toulouse pour suivre mon Master. J'y habite toujours aujourd'hui, et je m'y sens très bien.

J'ai eu la chance de beaucoup visiter le sud-ouest de la France, la Bretagne et le Portugal ; un peu la Provence et l'Espagne ; succintement les Pays-Bas, Bruxelles et la Tchéquie.

## Mes passions

Je suis amoureux du jeu vidéo. Dès l'enfance, j'étais fasciné par l'élégance des RPG japonais et la radicalité des jeux amateurs sur RPG Maker. Pendant l'adolescence, j'ai vibré avec Portal, Half-Life 2, Project Diva et Mirror's Edge, mais aussi avec le boom des jeux indépendants. Mes goûts ont ensuite été forgés par les jeux de Kojima, les Souls, Shadow of the Colossus, Destiny, Kane & Lynch 2, les jeux de Naughty Dog, les Yakuza, GTA5, Gravity Rush, Tearaway ; mais aussi par des jeux indépendants tels que FEZ, Journey, Superbrothers, The Witness et Oxenfree. Je suis passionné par les jeux en multi local comme Towerfall, BUTTON, Helldivers, Wilmot's Warehouse, Dragon's Crown et j'en passe.

Ma deuxième passion est sans doute le cinéma, avec une préférence pour le naturalisme. J'aime également la photographie, la programmation, la musique atmosphérique et électronique, les promenades, les restaurants et les cafés.

Quand j'étais enfant, je dessinais H24 au fond de la classe, mais j'ai arrêté au lycée car je ne savais plus trop quoi dessiner. Aujourd'hui, il m'arrive de gribouiller ce que je vois quand je voyage. J'ai récemment découvert que j'étais plus intéressé par le web design et la typographie, alors j'essaie d'expérimenter autour de ces sujets.

## Autres informations

Pour mon parcours professionnel, voir [Mes expériences pro](/pro).

Pour un récit plus personnel et complet de ma vie, voir [Vie personnelle](/personal-life).

## Me contacter

- Email : <em>aureliendsantos[at]gmail.com</em>
- Mastodon : [@aurelien@gamedevalliance.fr](https://mastodon.gamedevalliance.fr/@aurelien)
- Discord : Aurélien#1254

<script>
	const yearInMs = 3.15576e+10; // Using a year of 365.25 days (because leap years)
	const age = Math.floor((new Date() - new Date("1997/01/22").getTime()) / yearInMs);
	document.getElementById("age").textContent = age;
</script>
