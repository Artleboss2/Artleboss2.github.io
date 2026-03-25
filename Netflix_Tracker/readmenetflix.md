# 🎬 Netflix Tracker — Catalogue Complet

Un site web personnel pour suivre ta progression à travers le catalogue complet de Netflix. Coche les films et séries que tu as vus, suis ta progression en temps réel, et filtre par type, langue ou statut.

---

## 📸 Fonctionnalités

- **18 773 titres** — films et séries du catalogue Netflix US
- Barre de progression en temps réel avec pourcentage
- Filtres par **Films / Séries**, **Vu / À voir**, et recherche instantanée
- Badges de couleur : 🔴 rouge pour les films, 🔵 bleu pour les séries
- Métadonnées disponibles sur ~4 800 titres : année, langue, rating, note IMDb
- Progression sauvegardée localement dans le navigateur (localStorage)
- Fonctionne 100% hors ligne — aucune dépendance externe requise (sauf la police Google Fonts)
- Fichier HTML unique, aucune installation nécessaire

---

## 🚀 Utilisation

1. Télécharge le fichier `netflix-tracker-complet.html`
2. Ouvre-le dans ton navigateur
3. Coche les titres que tu as vus
4. Ferme, rouvre — ta progression est sauvegardée automatiquement

---

## 🛠️ Comment le projet a été construit

### Étape 1 — Prototype initial

Le projet a commencé comme un simple tracker HTML avec une liste d'environ 200 films représentatifs, organisés par genre. L'idée de base : une page web minimaliste avec des cases à cocher et une barre de progression.

### Étape 2 — Premier vrai catalogue (~4 800 films)

Pour obtenir un catalogue réel, un script Python a été utilisé pour scraper **whats-on-netflix.com**, un site tiers qui agrège les données du catalogue Netflix US. Ce premier jeu de données contenait de riches métadonnées : titre, année, catégorie, langue, rating, note IMDb, et description.

### Étape 3 — Catalogue étendu (~18 000 titres)

Pour aller plus loin, **51% du catalogue de uNoGS.com** (Unofficial Netflix Online Global Search) a été scrapé à l'aide d'un script Python automatisé. Cela a permis d'ajouter ~9 400 films supplémentaires et ~4 600 séries, portant le total à **18 773 titres**.

Les deux datasets ont ensuite été fusionnés et dédoublonnés : les entrées issues du premier scraping ont été prioritaires car elles contiennent les métadonnées complètes.

### Étape 4 — Optimisation du code

À la demande, les données des films ont été reformatées pour apparaître **une entrée par ligne** dans le code source plutôt qu'en une seule ligne géante, rendant le fichier lisible dans un éditeur de texte sans faire laguer la machine.

---

## ⚠️ Note éthique — Parlons franchement

Ce projet repose sur du **web scraping** de sites tiers (whats-on-netflix.com et uNoGS.com), ce qui soulève des questions éthiques qui méritent d'être posées honnêtement.

**Ce qui est discutable :**

- Scraper un site sans l'autorisation explicite de ses propriétaires va souvent à l'encontre de leurs Conditions d'Utilisation.
- Ces sites investissent du temps et de l'argent pour collecter, maintenir et mettre à jour leurs données. Extraire leur contenu en masse sans contribution ni accord, c'est profiter de leur travail gratuitement.
- Un scraping intensif (51% d'un catalogue entier) peut générer une charge non négligeable sur leurs serveurs.

**Ce qui atténue un peu les choses :**

- Les données scrappées (titres de films) sont des informations publiques — Netflix les affiche librement à ses abonnés.
- Le tracker est distribué gratuitement, sans monétisation d'aucune sorte.
- L'usage est personnel et non commercial.

**La conclusion honnête :**

Ce n'est pas très moral. Si tu utilises ce projet, sache que les données viennent d'un scraping non autorisé. Si un jour tu veux faire les choses proprement, uNoGS propose une API payante, et Netflix a une API officielle (très limitée) pour les partenaires.

Ce fichier est partagé tel quel, en toute transparence sur son origine. À toi de juger si tu veux l'utiliser.

---

## 📁 Structure du projet

```
netflix-tracker-complet.html   ← Le tracker complet (fichier unique)
README.md                      ← Ce fichier
```

---

## 📊 Sources de données

| Source | Titres | Métadonnées |
|--------|--------|-------------|
| whats-on-netflix.com | ~4 800 films | ✅ Complètes (année, genre, IMDb...) |
| uNoGS.com (51% scrapé) | ~14 000 films + séries | ❌ Titres uniquement |
| **Total fusionné** | **18 773 titres** | Partiel |

---

## 🔧 Stack technique

- **HTML / CSS / JavaScript** vanilla — zéro framework, zéro dépendance
- **Python** pour le scraping et la fusion des données
- Police : [Bebas Neue](https://fonts.google.com/specimen/Bebas+Neue) + [DM Sans](https://fonts.google.com/specimen/DM+Sans) via Google Fonts
- Stockage : `localStorage` du navigateur

---

*Projet personnel — non affilié à Netflix, uNoGS ou whats-on-netflix.com.*
