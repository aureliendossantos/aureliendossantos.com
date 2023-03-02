---
title: Notes sur le level design
description: Notes prises en regardant des vidéos de Craig Perko sur le level design de Nier et Fallout 4.
date: 2019-10-22
categories: ["Notes"]
tags: ["Jeux vidéo", "Game design"]
image: cover.png
---

Craig Perko publie des vidéos sur YouTube avec pour thème principal le développement de jeux vidéo : tutoriels de programmation, analyse de jeux, opinions sur le game design... Comme le pointait mon amie Erika, Craig Perko a parfois une vision différente des jeux et il utilise peu de _buzzwords_. Par exemple, il parle de _hinting_ qui serait généralement plutôt appelé _player guidance_, parce que cela correspond mieux à son ressenti.

Voici quelques notes que j'ai prises en regardant ses vidéos sur Nier et Fallout 4.

# Fallout 4 : Design de l'open world

## Point de départ

La heightmap détermine ce que le joueur voit, mais pas où il peut aller. C’est le rôle des meshes.​

![](intro.png)

Le jeu commence en hauteur pour nous montrer le prochain point (c’est le rôle de la heightmap). Cependant on est dissuadé de descendre tout droit par les rochers, barrières et tronc. Les meshes guident notre trajectoire vers un détour.​

La heightmap est globalement en pente durant la première partie du jeu, même s’il y a des creux tels que la rivière en contrebas. Cela nous donne une vision claire de la suite très régulièrement.​

## Guider le joueur vers le contenu

![](chemin.png)

Ici, ce n’est toujours pas la heightmap qui indique le chemin, à part pour la texture de terre battue. Elle est en fait assez plate et uniforme. C’est la végétation et les rochers tout autour qui forment une composition claire.​

La végétation n’empêchera pas le joueur d’aller sur le côté, mais c’est assez pour lui dire qu’il n’y a rien là-bas, et c’est la grande astuce des jeux open world.​

On dit souvent qu’un open world est un jeu où le joueur peut aller où il veut. En réalité, un open world est minutieusement balisé pour guider le joueur vers là où se trouve le contenu.​

## Premier village

![](ville-top.png) ![](ville-foot.png)

Le premier village est simple vu du ciel, mais tout change depuis la perspective du joueur.​

Comme la base est située en haut d’une colline et arrangée en arc-de-cercle, en arrivant à pied, on ne peut pas en voir les deux extrémités et elle paraît vaste. La légère pente montante suffit à bloquer notre vision tout en suggérant que le quartier continue.​

Ce que le joueur peut voir est ce que le joueur peut comprendre. Bloquer sa vision est une technique efficace pour rendre un lieu plus grand et complexe.​

Cet agencement est suffisant pour donner l’impression d’être perdu. Il n’y a pas besoin d’un lieu très grand, tant que l’on empêche le joueur d’en voir trop en même temps.​

# Le hinting dans Nier

Ce que Craig Perko appelle hinting dans sa vidéo, que l’on pourrait traduire par indication, inclut toute sorte de construction qui attire le joueur plus loin dans le niveau, sans pour autant qu’il en soit conscient.

C’est une collection de techniques à toujours garder en tête, car cela empêche les joueurs de se perdre ou de s’ennuyer. Lorsque c’est fait de façon subtile, cela évite la sensation d’être pris par la main à travers le niveau.

## Escalader et descendre

Les joueurs aiment grimper et regarder en bas. C’est une impulsion naturelle que vous pouvez utiliser à votre avantage. La verticalité est donc une attraction efficace.

Pour que cela fonctionne, le joueur doit bien comprendre qu’il peut emprunter ce chemin. Un ascenseur sera beaucoup moins parlant que des escaliers, par exemple.

## Éclairage

Les joueurs remarqueront facilement un endroit lumineux dans le noir.

Gardez en tête que l’éclairage peut être plus ou moins visible en fonction de la position du joueur.

![](tuyau.png "Dans cette section, il faut suivre le tuyau, mais c’est moins clair qu’un chemin car sous certains angles on peut penser que c’est une barrière.")

## Chemins

Les joueurs suivront naturellement les chemins pour peu qu’ils ressemblent à un chemin.

Par exemple, ils suivront une route délabrée, un pont en bois, mais pourront avoir du mal à comprendre si des éléments plus originaux sont des chemins ou non.

## Utiliser des barrières

Les barrières telles que des décombres et des murs convainquent le joueur qu’il n’y a rien à voir par là-bas. Vous pouvez utiliser ce phénomène psychologique à votre avantage.

Comme le joueur ira rarement tester les murs en s’approchant d’eux, vous pouvez créer des niveaux vastes sans avoir besoin de décorer les recoins inutiles.

![](coin1.png "La vue depuis le coin n’est pas convaincante...") ![](coin2.png "...mais la plupart des joueurs ne s’y aventureront pas.")

Les coins attirent l’œil et peuvent être désagréables. Il est important de les remplir avec des barrières pour permettre au regard du joueur de les balayer de façon fluide.

## Signposting

Utilisez des points de repère iconiques et autres indicateurs locaux pour attirer le joueur dans une direction.

![](horizon.png "Si votre horizon ou vos murs sont déjà trop chargés, faites l’inverse : créez une ouverture dans le décor pour indiquer le chemin.")

![](scene.png "Cette scène très efficace mêle plusieurs techniques de hinting : une descente satisfaisante à parcourir, une sortie encadrée par une structure en métal et visible de loin grâce au sol éclairé au milieu de l’obscurité.")

## Dernières observations

Le hint indique où le prochain endroit intéressant se trouve. Même en comprenant cela, le joueur fera parfois un détour pour explorer ou chercher un trésor, et c’est normal.

Cependant, il faut s’assurer que les hints restent visibles au fil de l’exploration. Parfois, on voit clairement l’objectif depuis une hauteur, puis en descendant, le changement de perspective efface le hint.

![](pdv.png "Depuis la hauteur, on voit clairement des points de fuite et des signposts à l’horizon.") ![](pdv-bas.png "Depuis le bas, les éléments du décor se confondent et paraissent plats.")

![](scene.png "Dans cette scène, le carré de lumière qui nous attire en contrebas...") ![](scene-bas.png "...perd en efficacité quand on descend, car le sol est aplati par la perspective.")

Le hinting doit mener à du contenu intéressant. Un hinting qui ne mène à rien est décevant.
