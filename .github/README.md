
# GitHub Workflows – DEV (IONOS)

Ce ZIP contient **3 workflows** prêts à l'emploi pour un hébergement mutualisé **IONOS** avec branche `develop` :

- `deploy-dev.yml` : déploie le code vers `/dev` **après merge** (et optionnellement sur push) via **FTPS**.
- `ci-pr.yml` : **Build & Tests** pour **bloquer le merge** si ça échoue (PR vers `develop`).
- `server-check-pr.yml` : **teste la connexion au serveur** (FTPS/SFTP) et l'écriture dans `/dev` **avant merge**.

## Installation

Place ces fichiers dans ton dépôt :

```
.github/
└─ workflows/
   ├─ deploy-dev.yml
   ├─ ci-pr.yml
   └─ server-check-pr.yml
```

## Secrets & Variables à configurer (Repository Settings → Actions)

### Variables (Variables → Actions)
- `ADRESSE_GLOBAL` : ex. `corbisier.fr`

### Secrets communs
- `REMOTE_CHEMIN` : ex. `/homepages/XX/dXXXXXXXX/htdocs`

### Pour le déploiement FTPS (`deploy-dev.yml`)
- `FTP_SERVER` : ex. `access-ssl.ionos.fr`
- `FTP_USERNAME`
- `FTP_PASSWORD`

### Pour le check FTPS (`server-check-pr.yml`)
- mêmes secrets que ci-dessus.

### Pour SFTP (si SSH activé chez IONOS — optionnel)
- `SFTP_HOST`
- `SFTP_USER`
- `SSH_PRIVATE_KEY` (clé privée correspondant à la publique présente dans `~/.ssh/authorized_keys` sur IONOS)

## Branch protection (bloquer le merge)

### Paramètres GitHub à activer

1. Aller dans **Settings → Branches → Branch protection rules → New rule**
2. Branch name pattern : `develop`
3. Activer :
   - ✅ **Require a pull request before merging**
   - ✅ **Require status checks to pass before merging**
   - ✅ **Require conversation resolution** (optionnel mais recommandé)
   - ✅ **Require branches to be up to date before merging** (optionnel mais recommandé)
   - ✅ **Include administrators** (optionnel, si tu veux appliquer aux admins aussi)

4. Dans la liste des checks disponibles, sélectionner comme **obligatoires** :  
   - `PHP / Composer / Tests`  
   - `Node / Build / Tests`  
   - `FTPS connectivity & write probe` **ou** `SFTP connectivity & write probe` (selon ton mode serveur)  

⚠️ Le job `deploy-dev.yml` s’exécute **après merge** et ne peut donc pas être utilisé comme *required check*.

### Vérification

Si un job n’apparaît pas encore dans la liste :
- Ouvre une Pull Request de test vers `develop`
- Laisse les workflows tourner une fois
- Reviens dans les paramètres pour cocher le job

## Personnalisation

- Dans `deploy-dev.yml`, supprime le bloc `push` si tu veux déclencher **uniquement après merge**.
- Ajoute des exclusions (`exclude:`) si tu as des répertoires à ignorer.
- Si tu utilises **FTPS implicite** chez IONOS, adapte le port à **990**.

## Dépannage rapide

- **Erreur d'auth FTPS** : vérifie `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD` et que le compte a accès à `REMOTE_CHEMIN`.
- **Port injoignable** : sur FTPS explicite, le port est **21** ; sur implicite, **990**.
- **SFTP échoue** : confirme que l'offre IONOS inclut SSH et que la clé publique est bien dans `~/.ssh/authorized_keys`.
- **Chemin cible incorrect** : la cible est `${REMOTE_CHEMIN}/${ADRESSE_GLOBAL}/dev/`

---

Bon déploiement ! 🚀
