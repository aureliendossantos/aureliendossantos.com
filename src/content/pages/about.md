---
title: À propos de moi
description: ""
aliases:
  - contact
  - aurelien
palette: whiteboard
layout: "$layouts/Future.astro"
---

Je m'appelle <em>Aurélien</em>, j'ai <em class="hover:text-[#4a8bf3]/80" title="Né le 22 janvier 1997 !"><span id="age">25</span> ans</em> et je vis à <em>Toulouse</em>.

Passionné par la vidéo, l'informatique et la pédagogie, je passe le plus clair de mon temps à combiner ces intérêts. Je réalise des tutoriels [sur YouTube](https://www.youtube.com/channel/UCCjlo6Ihet_T3X6bKLJzPsA) depuis mes 15 ans et j'écris des formations gratuites sur le site [FaireDesJeux.fr](https://fairedesjeux.fr).

Sur mon temps libre, je m'adonne au développement de jeux vidéo axés sur la communication. Mon projet principal est [QRPG](https://youtu.be/TE4jHjvZ1Nk?t=17), un hybride entre jeu vidéo et jeu de société. J'ai ainsi acquis quelques années d'expérience avec <em>Unity</em> et <em>C#</em>.

J'ai acquis un Master en <em>Concepteur de ressources numériques pédagogiques</em>, et pendant deux ans, j'ai occupé un poste <em>chef de projet e-learning</em> pour des parcours de formation en ligne ainsi que des serious games.

Aujourd'hui, je suis à la recherche de nouvelles opportunités en tant qu'<em>ingénieur pédagogique</em>, <em>concepteur e-learning</em> ou <em>concepteur de serious games</em>.<br/>Contactez-moi !

### Contact

- Email : <em>aureliendsantos[at]gmail.com</em>
- Mastodon : [@aurelien@gamedevalliance.fr](https://mastodon.gamedevalliance.fr/@aurelien)
- Discord : Aurélien#1254

### Quelques travaux

- [Portfolio](https://aureliendossantos.notion.site/)

### Expériences récentes

- Chef de projet e-learning, Les Digitales Consulting, 2021-aujourd'hui
- Président de l'association [Game Dev Alliance](https://gamedevalliance.fr/), 2018-aujourd'hui
- Traducteur anglais, Degica, 2018
- Réalisateur vidéo en micro-entreprise, 2015-2018

### Formation

- Master Conception de ressources numériques pédagogiques, 2021-2023
- Licence Langue anglaise, littérature et civilisation anglophone, 2018-2021
- IUT Statistique et informatique décisionnelle, 2014-2016

---

Ce site est réalisé avec le framework [Astro](https://astro.build/).

<script>
	const yearInMs = 3.15576e+10; // Using a year of 365.25 days (because leap years)
	const age = Math.floor((new Date() - new Date("1997/01/22").getTime()) / yearInMs);
	document.getElementById("age").textContent = age;
</script>
