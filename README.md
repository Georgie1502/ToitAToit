# Toit a Toit - Plateforme de colocation

Ce depot heberge une application de mise en relation pour la colocation, basee sur une architecture microservices Node.js/Express, des bases PostgreSQL et un frontend React/Tailwind. Ce README centralise les informations utiles pour installer, comprendre et faire evoluer le projet.

## Table des matieres

- [Toit a Toit - Plateforme de colocation](#toit-a-toit---plateforme-de-colocation)
  - [Table des matieres](#table-des-matieres)
  - [Vue d'ensemble](#vue-densemble)
  - [Glossaire](#glossaire)
  - [Architecture](#architecture)
  - [READMEs des sous-projets](#readmes-des-sous-projets)
  - [Journal des changements](#journal-des-changements)
  - [Installation et demarrage](#installation-et-demarrage)
    - [Prerequis](#prerequis)
    - [Demarrage rapide avec Docker](#demarrage-rapide-avec-docker)
    - [Demarrage local sans Docker](#demarrage-local-sans-docker)
  - [Fichiers Compose](#fichiers-compose)
  - [Directives](#directives)
  - [Gestion de l'IA](#gestion-de-lia)
  - [Kanban](#kanban)
  - [Git](#git)
    - [Strategie de branches](#strategie-de-branches)
    - [Conventions de commits](#conventions-de-commits)
  - [Tests](#tests)
  - [Securite et contribution](#securite-et-contribution)
  - [CI/CD](#cicd)
  - [Licence](#licence)

> Document vivant pour faciliter l'onboarding et garder une vision claire du projet.

## Vue d'ensemble

Services principaux :

- API Gateway (port 3000) : point d'entree unique, routage, rate limiting, logs.
- Users Service (port 3001) : authentification, profils et preferences utilisateurs.
- Colocations Service (port 3002) : annonces et gestion des colocations.
- Messages Service (port 3003) : messagerie entre utilisateurs.
- Frontend React (port 3004 en dev) : interface utilisateur (Tailwind CSS).

Stack cle : Node.js, Express, PostgreSQL (scripts init.sql), JWT, Axios, React, Tailwind.

## Glossaire

- Gateway : service qui centralise et distribue les requetes du frontend vers les microservices.
- Token JWT : jeton signe pour authentifier et autoriser les requetes.
- Rate limiting : limite de requetes par IP pour proteger les APIs.

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

- Gateway : voir backend/gateway/README.md.
- Users : backend/users-service/README.md.
- Colocations : backend/colocations-service/README.md.
- Messages : backend/messages-service/README.md.
- Frontend : frontend/toit-a-toit-frontend/README.md.

## Journal des changements

- A creer : `CHANGELOG.md` a la racine pour tracer les evolutions majeures.

## Installation et demarrage

### Prerequis

- Node.js 18+ et npm
- Docker et Docker Compose (recommande)

### Demarrage rapide avec Docker

```bash
cd backend/users-service && docker-compose up --build -d
cd backend/colocations-service && docker-compose up --build -d
cd backend/messages-service && docker-compose up --build -d
cd backend/gateway && docker-compose up --build -d
cd frontend/toit-a-toit-frontend && docker-compose up --build -d
```

Endpoints sante :
- Gateway : http://localhost:3000/health
- Users : http://localhost:3001/health
- Colocations : http://localhost:3002/health
- Messages : http://localhost:3003/health

### Demarrage local sans Docker

1. Copier les `.env` exemples quand disponibles (ex: backend/gateway/.env.example).
2. `npm install` dans chaque service et dans le frontend.
3. Demarrer PostgreSQL (conteneur ou local) et appliquer les `init.sql`.
4. Lancer :
	 - Gateway : `npm run dev`
	 - Users / Colocations / Messages : `npm run dev`
	 - Frontend : `npm start`

## Fichiers Compose

Chaque dossier de service possede un `docker-compose.yml` pour :
- Lancer le service Node.js
- Demarrer PostgreSQL initialise avec `init.sql`
- Exposer les ports utilises par la gateway

## Directives

- Style JS moderne (const/let, async/await), garder le code lisible.
- Revue de code pour toute feature ou correctif significatif.
- Documenter les evolutions (README locaux, ce fichier).

## Gestion de l'IA

Usage des outils d'IA autorise si le code est relu et teste par un humain. Documenter les decisions et valider la securite avant fusion.

## Kanban

Utiliser un tableau Kanban (GitHub Projects ou autre) pour suivre les taches. Nommer les cartes/coh. avec les branches (voir plus bas).

## Git

### Strategie de branches

- `main` : code stable, protégé — aucun push direct.
- Les branches de travail sont créées **automatiquement** à l'ouverture d'une issue dont le titre commence par `TOIT-XXXX`.
- Format : `feat/TOIT-XXXX` (automatique) ou `fix/TOIT-XXXX` / `docs/TOIT-XXXX` (manuel).
- Exemples réels : `feat/TOIT-1105`, `feat/TOIT-2001`, `docs/TOIT-7001`.

### Conventions de commits

Chaque message de commit doit commencer par un préfixe entre crochets. Ce préfixe détermine automatiquement le type de version incrémentée et la section dans le CHANGELOG.

| Préfixe | Usage | Impact version |
|---|---|---|
| `[ADD]` | Nouvelle fonctionnalité | MINEUR `0.8.9 → 0.9.0` |
| `[FIX]` | Correction de bug | PATCH `0.8.9 → 0.8.10` |
| `[DESIGN]` | Interface / visuel | PATCH |
| `[REFACTOR]` | Refactorisation interne | PATCH |
| `[DOCS]` | Documentation | PATCH |
| `[TEST]` | Tests | PATCH |
| `[BREAKING]` | Changement non rétrocompatible | MAJEUR `0.8.9 → 1.0.0` |

Règle de priorité : si une PR contient plusieurs commits, le plus impactant l'emporte.
Exemple : 1 `[ADD]` + 3 `[FIX]` → version MINEUR incrémentée.

```bash
git commit -m "[ADD] Ajout de la page recherche avancée"
git commit -m "[FIX] Correction du bug d'authentification sur mobile"
git commit -m "[REFACTOR] Centralisation du service d'appel API"
git commit -m "[TEST] Ajout des tests unitaires du contrôleur messages"
```

Règle d'or : en lisant le message, on doit savoir exactement ce qui a changé.
Un commit sans préfixe reconnu sera ignoré dans le CHANGELOG.

## Tests

Chaque service dispose de tests Jest dans un dossier `__tests__/`. La couverture minimale exigée est de 70 % (seuil configuré dans chaque `package.json`).

| Service | Commande |
|---|---|
| Gateway | `cd backend/gateway && npm test` |
| Users | `cd backend/users-service && npm test` |
| Colocations | `cd backend/colocations-service && npm test` |
| Messages | `cd backend/messages-service && npm test` |
| Frontend | `cd frontend/toit-a-toit-frontend && npm test` |

Les rapports de couverture HTML sont générés dans le dossier `coverage/` de chaque service.

Pour lancer tous les tests en local (depuis la racine) :

```bash
(cd backend/gateway && npm test) && \
(cd backend/users-service && npm test) && \
(cd backend/colocations-service && npm test) && \
(cd backend/messages-service && npm test) && \
(cd frontend/toit-a-toit-frontend && npm test -- --watchAll=false)
```

## Securite et contribution

- Rapporter toute vulnerabilite via issue ou canal prive.
- Ne pas commit de secrets; utiliser des variables d'environnement et `.env.example`.
- Valider les entrees utilisateur et limiter les droits via JWT.

## CI/CD

Deux pipelines GitHub Actions dans `.github/workflows/` :

- **CI** (`ci.yml`) : déclenché sur chaque push et PR vers `main`. Lance les tests Jest avec coverage pour chacun des 4 services backend et le frontend. Les rapports de couverture sont archivés comme artefacts Actions.
- **CD** (`cd.yml`) : déclenché sur les merges dans `main`. Construit et publie les images Docker (stage `production`) sur GitHub Container Registry (`ghcr.io`). Génère un tag de version sémantique `vYYYY.MM.DD-<sha>` et effectue un smoke test sur `/api/health` si `DEPLOY_URL` est configuré.

## Licence

- A definir : ajouter `LICENSE` (MIT, Apache-2.0, etc.).