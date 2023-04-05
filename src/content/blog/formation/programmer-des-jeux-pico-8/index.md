---
title: "Programmer des mini-jeux rétro avec PICO-8"
description: "Une formation gratuite et complète pour débuter."
date: 2020-12-27
categories: ["Formations"]
tags:
  - Programmation
  - Jeux
  - Game Dev Alliance
image: ./cover.png
cover: true
draft: true
palette: whiteboard
---

<style>
ul, ol {
  list-style: none; /* Remove default bullets */
}
ol {
  counter-reset: li;
}
ol li::before, ul li::before {
  color: #FF7BE2;
  display: inline-block;
  width: 1em;
}
ol li::before {
  content: counter(li) ".";
  margin-left: -1.5em;
  margin-right: 0.5em;
  text-align: right;
}
ol li {
  counter-increment: li;
}
ul li::before {
  content: "\2022";  /* \2022 is the CSS Code/unicode for a bullet */
  font-weight: bold;
  margin-left: -1em;
}
em {
  font-style: normal;
  color: #4A8BF3;
}
a {
  text-decoration-color: #4A8BF3;
}
h2, h3 {
  color: #4A8BF3;
}
</style>

[PICO-8](https://www.lexaloffle.com/pico-8.php) est une console imaginaire dans laquelle vous pouvez aussi bien développer votre jeu que jouer à ceux des autres. Il est très facile de commencer à créer un jeu avec PICO-8 car on peut tout faire à l'intérieur : la programmation, le dessin et même la musique !

Les contraintes techniques de PICO-8 simplifient l'apprentissage tout en donnant aux jeux un style très expressif. C'est pourquoi je l'ai utilisé comme support pour initier les apprentis game designers (et autres personnes curieuses) aux concepts fondamentaux de la programmation.

### Contenu de la formation

1. **Premiers pas :** les fonctions principales, lancer son jeu et le publier.
2. **Créer un shooter spatial :** tirer des projectiles sur des ennemis, animer les explosions, afficher un score.
3. **Créer un jeu d'aventure :** se déplacer sur une carte, gérer la caméra, interagir avec des objets, afficher des dialogues.
4. **Astuces avancées** (à l'écrit uniquement) **:** mettre en place des outils pour développer efficacement, programmer des déplacements dépendant de forces physiques, manipuler la mémoire.

### En vidéo

[https://www.youtube.com/playlist?list=PLHKUrXMrDS5t3ibCCh412ZAy0slIv3jeE](https://www.youtube.com/playlist?list=PLHKUrXMrDS5t3ibCCh412ZAy0slIv3jeE)

### En version écrite

[Programmer des mini jeux avec PICO-8](https://fairedesjeux.fr/pico-8/)

### Pour aller plus loin

[Economiser des tokens](https://wiki.gamedevalliance.fr/pico-8/tokens/)

[La mémoire](https://wiki.gamedevalliance.fr/pico-8/memoire/)
