---
title: Dashboard pour agence de formations
description: Rapports élégants dédiés aux partenaires, connectés via l'API à la base de données Notion en interne de l'agence.
client: Agence Insolence
roles:
  - Développement web
tools:
  - Notion (API)
  - React
moreTools:
  - Next.js
image: ./dashboard.png
---

Une difficulté était de gérer la lenteur de l'API de Notion. Charger une base de données de 500 cours peut parfois prendre 5 secondes, ce qui altère grandement l'expérience de navigation.

Pour pallier à ce problème, j'ai utilisé un squelette de chargement afin de faire patienter les utilisateurs, et j'ai découpé les requêtes de manière à pouvoir afficher les résultats progressivement.
