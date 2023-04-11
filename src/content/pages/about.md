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

Sur mon temps libre, je développe des jeux. Mon projet principal est [QRPG](https://youtu.be/TE4jHjvZ1Nk?t=17), un hybride entre jeu vidéo et jeu de société.

### Contact

- Email : <em>aureliendsantos[at]gmail.com</em>
- Mastodon : [@aurelien@gamedevalliance.fr](https://mastodon.gamedevalliance.fr/@aurelien)
- Discord : Aurélien#1254

### Côté pro

Je suis à la recherche de nouvelles opportunités en tant qu'<em>ingénieur pédagogique</em>, <em>concepteur e-learning</em> ou <em>concepteur de serious games</em>.

- <em>Chef de projet e-learning</em>, Les Digitales Consulting, 2021-aujourd'hui
- <em>Président</em> de l'association [Game Dev Alliance](https://gamedevalliance.fr/), 2018-aujourd'hui
- <em>Traducteur anglais</em>, Degica, 2018
- <em>Réalisateur vidéo</em> en micro-entreprise, 2015-2018

J'ai également quelques années d'expérience en autodidacte avec <em>Unity</em> et <em>C#</em>. [Portfolio](/portfolio)

### Formation

- Master <em>Conception de ressources numériques pédagogiques</em>, 2021-2023
- Licence <em>Langue anglaise</em>, littérature et civilisation anglophone, 2018-2021
- IUT <em>Statistique et informatique décisionnelle</em>, 2014-2016

---

Ce site est réalisé avec le framework [Astro](https://astro.build/).

<script>
	const yearInMs = 3.15576e+10; // Using a year of 365.25 days (because leap years)
	const age = Math.floor((new Date() - new Date("1997/01/22").getTime()) / yearInMs);
	document.getElementById("age").textContent = age;
</script>
