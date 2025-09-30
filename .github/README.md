
# GitHub Workflows – DEV (IONOS)

Ce ZIP contient **3 workflows** prêts à l'emploi pour un hébergement mutualisé **IONOS** avec branche `develop` :

- `deploy-dev.yml` : déploie le code vers `/dev` **après merge** (et optionnellement sur push) via **FTPS**.
- `ci-pr.yml` : **Build & Tests** pour **bloquer le merge** si ça échoue (PR vers `develop`).
- `server-check-pr.yml` : **teste la connexion au serveur** (FTPS/SFTP) et l'écriture dans `/dev` **avant merge**.

## Installation

Place ces fichiers dans ton dépôt :

```
.yarn.lock / package-lock.json  (si présents)
.github/
└─ workflows/
   ├─ deploy-dev.yml
   ├─ ci-pr.yml
   └─ server-check-pr.yml
```

## Secrets & Variables à configurer (Repository Settings → Actions)

### Variables (Variables → Actions → *Variables*)
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

1. GitHub → **Settings** → **Branches** → **Branch protection rules** → `develop`  
2. Activer **Require status checks to pass before merging**  
3. Sélectionner comme checks requis :
   - `PHP / Composer / Tests`
   - `Node / Build / Tests`
   - `FTPS connectivity & write probe` **ou** `SFTP connectivity & write probe` (selon ton mode)

> Note : `deploy-dev.yml` s’exécute **après merge**, donc ne peut pas être un *required check* avant merge.

## Personnalisation

- Dans `deploy-dev.yml`, supprime le bloc `push` si tu veux déclencher **uniquement après merge**.
- Ajoute des exclusions (`exclude:`) si tu as des répertoires à ignorer.
- Si tu utilises **FTPS implicite** chez IONOS, adapte le port à **990** et le protocole reste `ftps` (l'action supporte les deux, mais certains hébergements exigent 990).

## Dépannage rapide

- **Erreur d'auth FTPS** : vérifie `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD` et que le compte a accès à `REMOTE_CHEMIN`.
- **Port injoignable** : sur FTPS explicite, le port est **21** ; sur implicite, **990**. Les jobs `server-check` testent par défaut 21.
- **SFTP échoue** : confirme que l'offre IONOS inclut SSH et que la clé publique est bien dans `~/.ssh/authorized_keys`.
- **Chemin cible incorrect** : la cible est `${REMOTE_CHEMIN}/${ADRESSE_GLOBAL}/dev/`

---

Bon déploiement ! 🚀
