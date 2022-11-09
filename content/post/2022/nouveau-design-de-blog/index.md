---
title: "Nouveau design de blog"
description: ""
date: 2022-11-09T14:37:22+01:00
categories: ["Article"]
tags:
image:
license:
toc:
draft: true
---

Bon, ben j'ai fait un design de blog.

Je l'appelle *Animus*. Je ne compte pas le rendre open source dans un futur proche, tout simplement parce que le code est très *hacky* et que ce serait désagréable à personnaliser. En l'état j'aurais un peu honte que quiconque voie ça. Mais si quelqu'un est intéressé, je ferai un petit effort pour nettoyer tout ça avec plaisir !

Les différents design d'article sont stockés dans un dossier nommé `palettes`. Voici par exemple le thème `notebook` que j'aime beaucoup, utilisé dans mon article sur Destiny :

```toml
title: "notebook"
style:
    primaryColor: "#404040"
    secondaryColor: "#686868"
    specialColor: "#c45c7f"
    backgroundColor: "#f0efdd"
    headingsFont: "'Work Sans', sans-serif"
    mainFont: "'Work Sans', 'Noto Sans', sans-serif"
    specialFont: "'Work Sans', monospace"
    fontSize: "18px"
    lineHeight: "1.5"
    importUrl: "https://fonts.googleapis.com/css2?family=Work+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
```

Ensuite, pour choisir la palette, il suffit d'écrire `palettes: notebook` dans le [*front matter*](https://gohugo.io/content-management/front-matter/) d'un article.

Je ne suis pas encore très satisfait de l'accueil du blog. Je trouve que les effets d'ombre subtils ne sont pas cohérents avec les articles au design old school comme celui-ci. Il va falloir que je trouve une manière d'harmoniser l'ensemble tout en gardant cette idée de cartes radicalement différentes.
