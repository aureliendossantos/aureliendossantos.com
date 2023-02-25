---
title: "Nouveau design de blog"
date: 2022-11-09T14:37:22+01:00
categories: ["Article"]
---

Et voilà, après avoir longtemps utilisé le thème [Stack](https://github.com/CaiJimmy/hugo-theme-stack) par [Jimmy Cai](https://jimmycai.com/), j'ai fait mon propre thème de blog. Plus simple, plus humble peut-être, mais qui me permet quelques fantaisies. Qui me correspond mieux, en somme.

C'est marrant parce qu'on revient à un format épuré comme avec le premier thème que j'ai utilisé, [Rocinante](https://github.com/mavidser/hugo-rocinante), mais avec une nouveauté qui invite mieux à l'exploration (chose que faisait bien Stack).

Tout le principe de ce thème est que l'on puisse créer différentes palettes, qui sont des combinaisons de couleurs et de polices d'écriture. On peut ensuite appliquer une palette différente à chaque article, ce qui me permet d'obtenir un résultat plus expressif et unique.

Cela m'aide à voir chaque article comme une entité individuelle et à assumer que les sujets et formats ne sont pas toujours cohérents. Ce n'est pas parce qu'on a aimé un des articles de mon blog que l'on sera forcément intéressé par tous les autres. J'aime particulièrement mes palettes old school, comme sur cette page, qui m'aident à écrire en me prenant moins au sérieux. J'espère que vous ne les trouverez pas prétentieuses !

La palette d'un article est également reflétée sur sa carte dans la page d'accueil. Ainsi, on peut avoir un meilleur aperçu de l'ambiance d'un article avant de cliquer, et peut-être en être d'autant plus curieux.

J'appelle ce thème de blog _Animus_. Je ne compte pas le rendre open source dans un futur proche, tout simplement parce que le code est très _hacky_ et que ce serait désagréable à personnaliser. En l'état j'aurais un peu honte que quiconque voie ça. Mais si quelqu'un est intéressé, je ferai un petit effort pour le nettoyer avec plaisir !

Les différentes palettes sont des petits fichiers stockés dans un dossier nommé `palettes`. Voici par exemple le thème `notebook` que j'aime beaucoup, utilisé dans mon [article sur Destiny](/post/2021/destiny-introduction-analyse/) :

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

Ensuite, pour choisir la palette, il suffit d'écrire `palettes: notebook` dans le [_front matter_](https://gohugo.io/content-management/front-matter/) d'un article.

Je ne suis pas encore très satisfait de l'accueil du blog. Je trouve que les effets d'ombre subtils ne sont pas cohérents avec les articles au design old school comme celui-ci. Il va falloir que je trouve une manière d'harmoniser l'ensemble tout en gardant cette idée de cartes radicalement différentes.
