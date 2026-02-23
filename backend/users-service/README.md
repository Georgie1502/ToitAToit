# Users Service - Toit a Toit

Service d'authentification et gestion des utilisateurs (profils, preferences). Base Node.js/Express avec PostgreSQL et JWT.

## Demarrage rapide

### Avec Docker (recommande)

```bash
cd backend/users-service
docker-compose up --build -d
```

Base exposee par Docker Compose avec chargement du `init.sql`.

### Sans Docker (dev local)

```bash
cd backend/users-service
npm install
npm run dev
```

Prerequis : PostgreSQL accessible, variables d'environnement (`PORT`, `DATABASE_URL`, `JWT_SECRET`, etc.) renseignees via `.env` (ajouter un `.env.example`).

## Structure

```
users-service/
├── server.js              # Point d'entree Express
├── routes/
│   ├── auth.js            # /auth : signup, login, logout
│   ├── users.js           # /users : profil, CRUD, batch
│   └── preferences.js     # /preferences : CRUD preferences perso
├── controllers/           # Logique metier
├── middleware/authMiddleware.js  # Verification JWT
├── utils/tokenUtils.js    # Signature/verification des tokens
├── config/db.js           # Connexion PostgreSQL
├── init.sql               # Schema et seed de base
└── docker-compose.yml     # Service + base Postgres
```

## Endpoints principaux

- `POST /auth/signup` : inscription
- `POST /auth/login` : connexion
- `POST /auth/logout` : deconnexion
- `GET /users/profile` : recuperer mon profil (JWT)
- `PUT /users/profile` : creer/mettre a jour mon profil (JWT)
- `POST /users/batch` : lister plusieurs utilisateurs par ids (JWT)
- `GET /users` : liste paginee (JWT)
- `GET /users/:id` : detail par id (JWT)
- `PUT /users/:id` : mise a jour (JWT)
- `DELETE /users/:id` : suppression (JWT)
- `GET /preferences` : mes preferences (JWT)
- `POST /preferences` : creer/mettre a jour (JWT)
- `DELETE /preferences` : supprimer (JWT)

## Tests rapides avec curl

```bash
BASE="http://localhost:3001"

# Signup
curl -X POST "$BASE/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456","name":"Test"}'

# Login
TOKEN=$(curl -s -X POST "$BASE/auth/login" -H "Content-Type: application/json" -d '{"email":"test@test.com","password":"123456"}' | jq -r '.token')

# Profil
curl -H "Authorization: Bearer $TOKEN" "$BASE/users/profile"
```

## Securite

- JWT obligatoire sur toutes les routes hors `/auth/signup` et `/auth/login`.
- Ne pas commit de secrets; utiliser `.env` et des valeurs fortes pour `JWT_SECRET`.
- Valider et sanitiser les entrees (controllers et modele).

## Depannage

- **Connexion DB** : verifier `DATABASE_URL` et que le conteneur Postgres est demarre.
- **Port occupe** : ajuster `PORT` dans `.env` ou compose.
- **JWT invalide** : regenerer un token via `/auth/login`.

## Prochaines etapes

- Ajouter des tests unitaires/integration (Jest) pour auth et profils.
- Completer un `.env.example` documente.
- Ajouter la validation des schemas d'entree.
