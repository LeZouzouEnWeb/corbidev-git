# Git — Aide interactive

Centraliser les commandes Git courantes, avancées et la documentation associée dans une interface web rapide à consulter.
L'application met à disposition des listes de commandes prêtes à l'emploi, des fiches mémo et des liens directs vers les workflows d'automatisation du dépôt.

<!-- BADGES:START -->

## 🛡️ Statuts & Badges

![repo size](https://img.shields.io/github/repo-size/LeZouzouEnWeb/corbidev-git) ![issues](https://img.shields.io/github/issues/LeZouzouEnWeb/corbidev-git) ![pull requests](https://img.shields.io/github/issues-pr/LeZouzouEnWeb/corbidev-git) ![license](https://img.shields.io/github/license/LeZouzouEnWeb/corbidev-git) ![top language](https://img.shields.io/github/languages/top/LeZouzouEnWeb/corbidev-git)

_Généré le 2025-10-08 19:06:19 — synthèse des statuts ci-dessous._

**Branches principales**

| Branche | Checks                                                                                            | Dernier commit                                                                                           | Vérification serveur                                                                                                                                                                                                                                         | Déploiement                                                                                                                                                                                                                       |
| ------- | ------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| develop | ![checks develop](https://img.shields.io/github/checks-status/LeZouzouEnWeb/corbidev-git/develop) | ![last commit develop](https://img.shields.io/github/last-commit/LeZouzouEnWeb/corbidev-git/develop.svg) | [![Vérification serveur Dev (PR)](https://github.com/LeZouzouEnWeb/corbidev-git/actions/workflows/dev-server-check-pr.yml/badge.svg?branch=develop)](https://github.com/LeZouzouEnWeb/corbidev-git/actions/workflows/dev-server-check-pr.yml?query=branch%3Adevelop) | [![Déploiement Dev](https://github.com/LeZouzouEnWeb/corbidev-git/actions/workflows/dev-deploy.yml/badge.svg?branch=develop)](https://github.com/LeZouzouEnWeb/corbidev-git/actions/workflows/dev-deploy.yml?query=branch%3Adevelop)   |
| homol   | ![checks homol](https://img.shields.io/github/checks-status/LeZouzouEnWeb/corbidev-git/homol)     | ![last commit homol](https://img.shields.io/github/last-commit/LeZouzouEnWeb/corbidev-git/homol.svg)     | [![Vérification serveur Homol](https://github.com/LeZouzouEnWeb/corbidev-git/actions/workflows/homol-server-check-pr.yml/badge.svg?branch=homol)](https://github.com/LeZouzouEnWeb/corbidev-git/actions/workflows/homol-server-check-pr.yml?query=branch%3Ahomol)    | [![Déploiement Homol](https://github.com/LeZouzouEnWeb/corbidev-git/actions/workflows/homol-deploy.yml/badge.svg?branch=homol)](https://github.com/LeZouzouEnWeb/corbidev-git/actions/workflows/homol-deploy.yml?query=branch%3Ahomol) |
| main    | ![checks main](https://img.shields.io/github/checks-status/LeZouzouEnWeb/corbidev-git/main)       | ![last commit main](https://img.shields.io/github/last-commit/LeZouzouEnWeb/corbidev-git/main.svg)       | [![Vérification serveur Prod](https://github.com/LeZouzouEnWeb/corbidev-git/actions/workflows/prod-server-check-pr.yml/badge.svg?branch=main)](https://github.com/LeZouzouEnWeb/corbidev-git/actions/workflows/prod-server-check-pr.yml?query=branch%3Amain)         | [![Déploiement Prod](https://github.com/LeZouzouEnWeb/corbidev-git/actions/workflows/prod-deploy.yml/badge.svg?branch=main)](https://github.com/LeZouzouEnWeb/corbidev-git/actions/workflows/prod-deploy.yml?query=branch%3Amain)      |

**Workflows CI/CD**

[![Analyse CodeQL](https://github.com/LeZouzouEnWeb/corbidev-git/actions/workflows/CodeQL.yml/badge.svg)](https://github.com/LeZouzouEnWeb/corbidev-git/actions/workflows/CodeQL.yml) [![Blocage des push directs sur branches protégées](https://github.com/LeZouzouEnWeb/corbidev-git/actions/workflows/block-direct-push.yml/badge.svg)](https://github.com/LeZouzouEnWeb/corbidev-git/actions/workflows/block-direct-push.yml)

---

Develop :

[![Mettre à jour le titre de la PR](https://github.com/LeZouzouEnWeb/corbidev-git/actions/workflows/update-pr-title.yml/badge.svg)](https://github.com/LeZouzouEnWeb/corbidev-git/actions/workflows/update-pr-title.yml) [![Lier les tickets à la PR](https://github.com/LeZouzouEnWeb/corbidev-git/actions/workflows/link-issues-in-pr.yml/badge.svg)](https://github.com/LeZouzouEnWeb/corbidev-git/actions/workflows/link-issues-in-pr.yml) [![Commenter les commits sur le ticket puis le cloturer](https://github.com/LeZouzouEnWeb/corbidev-git/actions/workflows/comment-and-close-ticket.yml/badge.svg)](https://github.com/LeZouzouEnWeb/corbidev-git/actions/workflows/comment-and-close-ticket.yml) [![Supprimer la branche après fusion](https://github.com/LeZouzouEnWeb/corbidev-git/actions/workflows/delete-branch-after-merge.yml/badge.svg)](https://github.com/LeZouzouEnWeb/corbidev-git/actions/workflows/delete-branch-after-merge.yml)

---

Homol et Main :

[![PR de develop vers homol](https://github.com/LeZouzouEnWeb/corbidev-git/actions/workflows/homol-check-pr-depuis-dev.yml/badge.svg)](https://github.com/LeZouzouEnWeb/corbidev-git/actions/workflows/homol-check-pr-depuis-dev.yml)

**Correspondance des badges**

| Workflow file                                   | Badge label                         |
| ----------------------------------------------- | ----------------------------------- |
| .github/workflows/CodeQL.yml                    | 🔣 Analyse CodeQL                   |
| .github/workflows/block-direct-push.yml         | 🚫 Blocage des push directs sur branches protégées |
| .github/workflows/dev-server-check-pr.yml       | 🔳 Vérification serveur Dev         |
| .github/workflows/homol-server-check-pr.yml     | 🔳 Vérification serveur Homol       |
| .github/workflows/prod-server-check-pr.yml      | 🔳 Vérification serveur Prod        |
| .github/workflows/dev-deploy.yml                | 🚀 Déploiement Dev                  |
| .github/workflows/homol-deploy.yml              | 🚀 Déploiement Homol                |
| .github/workflows/prod-deploy.yml               | 🚀 Déploiement Prod                 |
| .github/workflows/homol-check-pr-depuis-dev.yml | 🔒 PR de develop vers homol         |
| .github/workflows/update-pr-title.yml           | 🔄 Mettre à jour le titre de la PR  |
| .github/workflows/delete-branch-after-merge.yml | 🗑️ Supprimer la branche après fusion |
| .github/workflows/link-issues-in-pr.yml         | 🔗 Lier les tickets à la PR         |
| .github/workflows/comment-and-close-ticket.yml  | 📝 Commenter les commits sur le ticket puis le cloturer |

<!-- BADGES:END -->

---

## ✨ Fonctionnalités

- Interface monopage en trois onglets : commandes courantes, catalogue par catégorie et mini documentation.
- Recherche instantanée et filtrage contextuel sur chaque onglet.
- Copier/coller des commandes et fiches mémo avec accusé visuel et comptage local des usages.
- API PHP sécurisée (`public/api/modules.php`) qui expose les données JSON en lecture seule.
- Badges GitHub Actions dynamiques pour suivre l'état des branches `develop`, `homol` et `main`.
- Workflow 🚫 Blocage des push directs sur branches protégées interdisant tout push direct sur les branches principales en dehors des acteurs autorisés (`web-flow`, bots GitHub, Dependabot).

## 🗂️ Structure des données

- `data/courantes/` : commandes les plus utilisées regroupées par thème.
- `data/categories/` : catalogue complet organisé par fonctionnalité Git.
- `data/docs/` : fiches explicatives plus longues (JSON avec un tableau `items`).

Chaque module est un fichier JSON. Pour ajouter une ressource :

1. Créez un fichier dans le dossier approprié (ex. `data/courantes/merge.json`).
2. Respectez la structure existante (`cmd`, `description` pour les commandes ; `title`, `text`/`html` pour la doc).
3. Commitez ; l'interface détecte automatiquement le nouveau module.

## 🚀 Lancer le projet en local

Pré-requis : PHP >= 8.1 et une connexion internet pour charger les badges.

```bash
git clone https://github.com/LeZouzouEnWeb/corbidev-git.git
cd corbidev-git
php -S 127.0.0.1:8000 -t public
```

Ouvrez ensuite [http://127.0.0.1:8000](http://127.0.0.1:8000) dans votre navigateur.

## 🔧 Notes de développement

- Le code client principal se trouve dans `public/assets/js/app.js`.
- Les styles et l'accessibilité sont gérés dans `public/assets/css/style.css`.
- Les workflows GitHub Actions sont documentés dans `.github/README_workflows.md`.
- Les badges en en-tête sont régénérés automatiquement par script ; laissez les marqueurs `<!-- BADGES:START/END -->` en place.

## 🤝 Contribution

Les contributions (nouvelles fiches, corrections ou améliorations UI) sont les bienvenues via Pull Request.
Pensez à vérifier les workflows concernés et à lier les issues aux PR pour profiter de l'automatisation existante.
