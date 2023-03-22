---
title: "PowerUp, le serious game sur la transition énergétique"
description: "J'ai réalisé un prototype pour répondre à cette question qui me taraudait : que donnerait un jeu de gestion pour apprendre aux jeunes les problématiques d'une transition écologique ?"
date: 2023-01-29T16:14:00+01:00
categories:
  - Article
tags:
  - Unity
  - Projet perso
  - Jeux vidéo
palette: whiteboard
draft: true
---

Si, dans les <dfn title ="Jeu de construction et de gestion d'une ville">city-builders</dfn> modernes, il est souvent demandé de produire de l'électricité à l'aide de différentes centrales, de nombreuses problématiques intéressantes liées au réseau électrique sont mises sous le tapis. Par exemple, dans _Cities: Skylines_, il faut faire attention à la pollution des sols et la pollution sonore, mais d'autres problématiques majeures de la transition énergétiques ne sont pas représentées, notamment la **stabilité du réseau** et le fait que certaines énergies sont **intermittentes**.

Ainsi, dans la vraie vie, il serait impossible d'être écolo en remplaçant toute notre production par des champs d'éoliennes, car elles ne peuvent pas produire d'énergie en continu ! Il faut forcément compenser avec des **sources d'énergie pilotables** comme le nucléaire. Cette notion, peu abordée à l'école, me semble pourtant cruciale pour comprendre les difficultés d'une transition énergétique réussie.

Si ces questions n'ont peut-être pas leur place dans un _Cities: Skylines_, il serait facile de les traduire en mécaniques dans un jeu dédié. En fait, le concept me semble si naturel qu'il ne m'a pas quitté depuis que nous l'avons suggéré dans notre vidéo sur l'écologie pour Game Dev Alliance[^vidéo]. Quand j'ai dû réaliser un serious game dans le cadre de mes études, j'ai sauté sur l'occasion pour produire ce prototype, *PowerUp* !

[^vidéo]: « [Peut-on jouer aux jeux vidéo et être écolo ?](https://www.youtube.com/watch?v=pXkEx7iBvEo) » écrit par [Goulven Clec'h](https://goulven-clech.dev) et réalisé par [Aurélien Dos Santos](https://aureliendossantos.com), Game Dev Alliance, 28 décembre 2021

<!--
<div style="position:relative;padding-bottom:56.25%;">
	<iframe
		style="width:100%;height:100%;position:absolute;left:0px;top:0px;"
		width="100%"
		height="100%"
		allowfullscreen
		src="/games/PowerUp/index.html"
	></iframe>
</div>
-->

[Jouer](/games/PowerUp/index.html)

<aside style="font-size: smaller">

**Le pitch :** _PowerUp_ est un jeu de gestion dans lequel vous devez alimenter la ville en
électricité de manière écologique. Mais votre mission ne sera pas simple, car vous devrez répondre
aux exigences des acteurs locaux qui ont chacun une idée bien précise de ce qui serait bon pour la
ville...

</aside>

---

### L'objectif du jeu

Dans le cadre de ce projet, nous souhaitons penser le jeu vidéo comme étant un système de règles et de variables avec lequel le joueur peut expérimenter. D'après cette conception, le jeu vidéo est tout indiqué pour représenter un système du monde réel via son gameplay : jeu de gestion de ville, jeu d'apprentissage d'une langue, etc.

Nous aimerions tirer parti des vastes possibilités offertes par Unity pour créer un jeu centré sur les mécaniques, et ainsi représenter des systèmes qui vont au-delà du jeu textuel. L'approche orientée objet d'Unity semble justement adaptée à la réalisation de jeux de gestion avec plusieurs entités indépendantes.

D'après notre étude des jeux sur l'écologie et les retours d'enseignants, nous avons conclu qu'il serait intéressant de réaliser un **jeu de gestion sur le thème du mix électrique.** Le joueur doit mettre en place un réseau de production d'électricité qui permette d'alimenter une ville tout en respectant des contraintes comme la stabilité du réseau.

En plus d’être un défi intéressant, cela permet de sensibiliser aux difficultés liées au mix électrique : une transition énergétique ne se résume pas à planter quelques éoliennes, mais bien à créer un équilibre plus complet ! Un sujet d'actualité puisque les médias évoquent en ce moment la possible instabilité du réseau électrique français pour les hivers à venir.

Le joueur devra également composer avec les exigences des militants et autres acteurs de la région. Cet aspect social nous permettra de mieux représenter la réalité du terrain ainsi que l’enjeu « engagement collectif et partenarial » listé par l’[Agenda EDD 2030](https://www.education.gouv.fr/bo/20/Hebdo36/MENE2025449C.htm).

Ce sujet n'a pas encore été abordé dans un jeu éducatif populaire mais nous paraît intéressant d'un point de vue ludique et peut aussi bien être accessible au grand public que s'intégrer à une séquence de SVT, de sciences ou de Géographie.

À l'inverse, aborder le développement durable au sens large serait plus pertinent sous la forme d'un jeu textuel aux variables simplifiées comme _The Climate Game_. Nous intégrons tout de même des thèmes généraux à notre jeu (par exemple l'électrification du mix énergétique, via la rénovation des bâtiments et les voitures électriques) via les acteurs locaux et une variété d’événements.

### Les personnages

Le joueur rencontrera au cours de la partie les trois acteurs locaux.

**Le militant :** Il est bien intentionné mais campe trop sur ses positions, qu’importe qu’elles soient justes ou non. Respectez ses contraintes si vous ne voulez pas faire la une des réseaux sociaux !

**Le banquier :** Un projet de transition énergétique ambitieux ? Cet aventurisme ne le rassure pas… sauf si vous remplissez ses garanties financières bien sûr.

**La politique :** La transition énergétique, elle trouve ça cool, mais ce qu’elle trouverait encore plus cool, c’est que vous remplissiez les promesses qu’elle a tenues pendant la campagne électorale !

Les trois acteurs locaux sont l’occasion de critiquer avec bienveillance trois types de mauvaises postures face au changement climatique.

Pour mener à bien ce projet, j'ai été aidé par mon fidèle ami [Goulven](https://goulven-clech.dev/) qui m'a beaucoup inspiré sur les différents moyens de transformer les problématiques écologiques en mécaniques de jeu. Après avoir mis au point le design, j'ai programmé tout ça en une grosse semaine ; ça a été l'occasion d'apprendre quelques astuces sur Unity !

---

Je serais ravi d'étendre le jeu au sein d'une structure pro, car les idées pour la suite ne manquent pas ! De plus, le contexte pour qu'un tel jeu soit apprécié me semble favorable. Ces dernières années, les programmes scolaires ont été renforcés sur la biodiversité et le climat. L'Éducation Nationale encourage une éducation transversale qui s'appuie sur toutes les disciplines, de la maternelle à la terminale. Les possibilités d'intégration d'une activité ludique sont donc nombreuses ! Ce jeu est pensé pour créer le débat en classe et trouverait facilement sa place dans un cours de SVT, de géographie ou d'éducation civique.

Bien sûr, étant un passionné de jeu vidéo, mon but premier est que le jeu soit fun en lui-même, pour que toute la famille ait envie d'y jouer à la maison. 😊 N'hésitez pas à me [contacter](/about#contact) pour me dire ce que vous en avez pensé ; j'ai hâte de lire vos retours.
