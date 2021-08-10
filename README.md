## imageProcessing

En local, l'imageProcessing (gourmand en énergie) est désactivé grâce à `config/development/params.yaml`. Il faudra donc s'assurer que `development/params.yaml` et `_default/params.yaml` restent identiques à part sur ce détail.

Actuellement l'imageProcessing :

- `render-image.html` : convertit les images dans les fichiers Markdown de plus de 1300px de large en WebP de 1300px de large (conserve le ratio). Les images de moins de 1300px de large ne subissent aucun traitement (je me suis dit que c'était pas worth de faire un système plus détaillé).
- `header.html` : convertit toutes les images en WebP, et celles dépassant 1600px de large sont redimensionnées à 1600px de large (conserve le ratio).
- d'autres trucs tout petits à travers le thème, qui ne valent pas le coup de le patcher juste pour tout convertir en WebP.

## tabs

Les tabs (utilisés dans le tutoriel sur Hugo) proviennent de [cet article](https://blog.jverkamp.com/2021/01/27/a-tabbed-view-for-hugo/) qui les a apparemment lui-même récupérés de w3schools. Mais il a créé les shortcodes et pour ça on l'apprécie.

```
{{< tabs "id unique" >}}       <-- normalement on peut omettre l'id et il en crée un mais des fois c'est bugué
{{< tab "Nom de l'onglet" >}}
Contenu
{{< /tab >}}
{{< tab "Nom de l'onglet" >}}
Contenu
{{< /tab >}}
{{< /tabs >}}
```

Nécessite les shortcodes `tab.html`, `tabs.html`, ainsi qu'un `custom.js` et du `custom.scss`.

J'ai légèrement adapté le js de l'article pour qu'il ne nécessite pas jQuery (d'ailleurs, il est important que le js soit inclus en bas de la page) et adapté le CSS.

- [] BUG : si dans deux tabsets différents, y a une tab qui a le même nom dans les deux, ça va toujours ouvrir dans le premier tabset.

### Todo

- [] Les liens manquent de visibilité dans les tabs (et ptet dans les blockquotes mtn que j'y pense ? à vérifier)
- [] Le ptit morceau de bordure à gauche qui change de couleur. J'ai eu la flemme parce qu'il faudrait créer une couleur spéciale (à cause de la couche alpha) mais c'est facile à faire. Tant qu'à faire ptet mettre plus de padding à gauche et à droite sur les onglets pour être dans l'esprit du design plus horizontal du blog.
