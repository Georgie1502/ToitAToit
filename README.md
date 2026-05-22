# Toit à Toit — Plateforme d'habitat inclusif

Plateforme de mise en relation pour l'habitat inclusif à Toulouse, développée pour une association intermédiaire entre hébergeurs et bénéficiaires. Architecture microservices Node.js/Express, bases PostgreSQL isolées, frontend React/Tailwind.

## Table des matières

- [Vue d'ensemble](#vue-densemble)
- [Glossaire](#glossaire)
- [Architecture](#architecture)
- [READMEs des sous-projets](#readmes-des-sous-projets)
- [Journal des changements](#journal-des-changements)
- [Installation et démarrage](#installation-et-démarrage)
  - [Prérequis](#prérequis)
  - [Démarrage rapide avec Docker](#démarrage-rapide-avec-docker)
  - [Démarrage local sans Docker](#démarrage-local-sans-docker)
- [Fichiers Compose](#fichiers-compose)
- [Directives](#directives)
- [Gestion de l'IA](#gestion-de-lia)
- [Kanban](#kanban)
- [Git](#git)
  - [Stratégie de branches](#stratégie-de-branches)
  - [Conventions de commits](#conventions-de-commits)
- [Tests](#tests)
- [Sécurité et contribution](#sécurité-et-contribution)
- [CI/CD](#cicd)
- [Licence](#licence)

> Document vivant pour faciliter l'onboarding et garder une vision claire du projet.

## Vue d'ensemble

Services principaux :

- **API Gateway** (port 3000) : point d'entrée unique, routage, rate limiting, logs.
- **Users Service** (port 3001) : authentification, profils et préférences utilisateurs.
- **Colocations Service** (port 3002) : annonces et gestion des colocations.
- **Messages Service** (port 3003) : messagerie entre utilisateurs.
- **Frontend React** (port 3004 en dev) : interface utilisateur (Tailwind CSS).

Stack clé : Node.js, Express, PostgreSQL, JWT, Axios, React, Tailwind.

## Glossaire

- **Gateway** : service qui centralise et distribue les requêtes du frontend vers les microservices.
- **Token JWT** : jeton signé pour authentifier et autoriser les requêtes.
- **Rate limiting** : limite de requêtes par IP pour protéger les APIs.
- **Hébergeur** : utilisateur qui publie des annonces de colocation.
- **Bénéficiaire** : utilisateur qui postule aux annonces.
- **Association** : intermédiaire qui valide les annonces et sélectionne les candidats.

## Architecture

```
Frontend React
      ↓
API Gateway :3000
      ↓
      ├─→ Users Service :3001
      ├─→ Colocations Service :3002
      └─→ Messages Service :3003
```

Chaque service contient son `Dockerfile`, un `docker-compose.yml` et un `init.sql` pour provisionner PostgreSQL.

## READMEs des sous-projets

- Gateway : `backend/gateway/README.md`
- Users : `backend/users-service/README.md`
- Colocations : `backend/colocations-service/README.md`
- Messages : `backend/messages-service/README.md`
- Frontend : `frontend/toit-a-toit-frontend/README.md`

## Journal des changements

Voir [CHANGELOG.md](CHANGELOG.md) pour l'historique des versions. Mis à jour automatiquement à chaque merge sur `main`.

## Installation et démarrage

### Prérequis

- Node.js 20+ et npm
- Docker et Docker Compose (recommandé)

### Démarrage rapide avec Docker

```bash
cd backend/users-service && docker-compose up --build -d
cd backend/colocations-service && docker-compose up --build -d
cd backend/messages-service && docker-compose up --build -d
cd backend/gateway && docker-compose up --build -d
cd frontend/toit-a-toit-frontend && docker-compose up --build -d
```

Endpoints santé :

- Gateway : http://localhost:3000/health
- Users : http://localhost:3001/health
- Colocations : http://localhost:3002/health
- Messages : http://localhost:3003/health

### Démarrage local sans Docker

1. Installer les dépendances racine (installe les hooks git via husky) :

```bash
npm install
```

2. Copier les `.env` exemples quand disponibles (ex: `backend/gateway/.env.example`).
3. `npm install` dans chaque service et dans le frontend.
4. Démarrer PostgreSQL (conteneur ou local) et appliquer les `init.sql`.
5. Lancer :
   - Gateway : `npm run dev`
   - Users / Colocations / Messages : `npm run dev`
   - Frontend : `npm start`

## Fichiers Compose

Chaque dossier de service possède un `docker-compose.yml` pour :
- Lancer le service Node.js
- Démarrer PostgreSQL initialisé avec `init.sql`
- Exposer les ports utilisés par la gateway

## Directives

- Style JS moderne (const/let, async/await), garder le code lisible.
- Revue de code pour toute feature ou correctif significatif.
- Documenter les évolutions (READMEs locaux, ce fichier).

## Gestion de l'IA

Usage des outils d'IA autorisé si le code est relu et testé par un humain. Documenter les décisions et valider la sécurité avant fusion.

## Kanban

Utiliser GitHub Projects pour suivre les tâches. Les issues sont nommées `TOIT-XXXX Description` pour la traçabilité issue → branche → PR → déploiement.

## Git

### Stratégie de branches

- `main` : code stable, protégé — aucun push direct, PR obligatoire avec 1 approbation.
- Les branches de travail sont créées **automatiquement** à l'ouverture d'une issue dont le titre commence par `TOIT-XXXX`.
- Merge via **Squash merge** uniquement — un commit propre par feature sur `main`.

Format des branches :

| Format | Exemple | Création |
|---|---|---|
| `feat/TOIT-XXXX` | `feat/TOIT-1105` | Automatique via workflow GitHub |
| `feat/TOIT-XXXX-description` | `feat/TOIT-1105-page-recherche` | Manuelle |
| `fix/TOIT-XXXX-description` | `fix/TOIT-2001-bug-deconnexion` | Manuelle |
| `docs/TOIT-XXXX-description` | `docs/TOIT-7001-readme-gateway` | Manuelle |
| `refactor/TOIT-XXXX-description` | `refactor/TOIT-3001-auth` | Manuelle |
| `test/TOIT-XXXX-description` | `test/TOIT-4001-gateway` | Manuelle |

### Conventions de commits

Le projet suit la convention **[Conventional Commits](https://www.conventionalcommits.org/)**, vérifiée automatiquement par commitlint et husky.

Format :

```
type(scope): description courte
```

| Type | Usage | Impact version |
|---|---|---|
| `feat` | Nouvelle fonctionnalité | MINEUR |
| `fix` | Correction de bug | PATCH |
| `docs` | Documentation | PATCH |
| `refactor` | Refactorisation | PATCH |
| `test` | Tests | PATCH |
| `perf` | Performance | PATCH |
| `style` | Mise en forme | PATCH |
| `chore` | Maintenance | aucun |
| `feat!` / `fix!` | Changement non rétrocompatible | MAJEUR |

Exemples :

```bash
git commit -m "feat(frontend): add mobile navigation menu"
git commit -m "fix(gateway): resolve JWT timeout on long requests"
git commit -m "refactor(users): simplify password validation"
git commit -m "test(gateway): add integration tests for auth routes"
git commit -m "feat!: rename colocations-service to annonces-service"
```

Le **titre de la PR** suit le même format — il devient le commit squash sur `main`.

Voir [CONTRIBUTING.md](CONTRIBUTING.md) pour le guide complet.

## Tests

Chaque service dispose de tests Jest dans un dossier `__tests__/`. La couverture minimale exigée est de **70 %** par service backend.

| Service | Commande |
|---|---|
| Gateway | `cd backend/gateway && npm test` |
| Users | `cd backend/users-service && npm test` |
| Colocations | `cd backend/colocations-service && npm test` |
| Messages | `cd backend/messages-service && npm test` |
| Frontend | `cd frontend/toit-a-toit-frontend && npm test` |

Pour lancer tous les tests depuis la racine :

```bash
(cd backend/gateway && npm test) && \
(cd backend/users-service && npm test) && \
(cd backend/colocations-service && npm test) && \
(cd backend/messages-service && npm test) && \
(cd frontend/toit-a-toit-frontend && npm test -- --watchAll=false)
```

## Sécurité et contribution

- Rapporter toute vulnérabilité via issue privée.
- Ne jamais committer de secrets — utiliser des variables d'environnement et `.env.example`.
- Valider les entrées utilisateur et limiter les droits via JWT.
- Secret scanning et push protection activés sur le dépôt.

## CI/CD

Quatre pipelines GitHub Actions dans `.github/workflows/` :

- **CI** (`ci.yml`) : déclenché sur chaque push et PR vers `main`. Valide le titre de la PR (Conventional Commits), lance lint, tests Jest avec coverage et audit de sécurité des dépendances pour chacun des 5 services. La PR ne peut pas être mergée si un job échoue.

- **CD** (`cd.yml`) : déclenché sur les merges dans `main`. Construit et publie les images Docker sur GitHub Container Registry (`ghcr.io`), déclenche le déploiement sur Render, génère un tag git et effectue un smoke test sur `/health`.

- **Changelog** (`changelog.yml`) : déclenché sur les merges dans `main`. Lit les commits Conventional Commits, calcule le bump sémantique, met à jour `CHANGELOG.md` et crée une PR automatique.

- **Create branch from issue** (`create-branch-from-issue.yml`) : crée automatiquement une branche `feat/TOIT-XXXX` à l'ouverture d'une issue dont le titre commence par `TOIT-XXXX`.

## Licence

À définir — ajouter `LICENSE` (MIT, Apache-2.0, etc.).
