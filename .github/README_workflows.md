# 🧭 Guide des Workflows GitHub Actions

> Document généré automatiquement le **2025-10-08 10:43:40** à partir des fichiers du dossier `.github/workflows/`.

Ce document explique le rôle de chaque workflow, leurs déclencheurs (`on:`), leurs `jobs`, les `steps` principaux et les variables utilisées.

---
## 💡 Bonnes pratiques CI/CD

- **Modularisez** vos workflows : un rôle clair par fichier (`deploy`, `PR`, `notify`, etc.).
- Utilisez des **noms explicites** pour les `jobs` et `steps`.
- Définissez les **permissions minimales** nécessaires.
- Ne logguez jamais de valeurs de `secrets` !
- Validez vos fichiers avec [YAML Lint](https://www.yamllint.com/) avant commit.

## 🧯 Dépannage

- **Workflow absent** : vérifiez qu’il est committé sur la branche par défaut.
- **Erreur `Unrecognized named-value`** : la variable (`secrets`, `vars`, `env`) est utilisée au mauvais niveau.
- **Erreur de déploiement** : testez les chemins distants et les credentials SSH/FTP.
- **Échec de titre PR** : vérifiez les regex dans les expressions et les cas particuliers (`ticket-*`, underscores, etc.).