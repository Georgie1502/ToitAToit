# Colocations Service - Toit a Toit

Service de gestion des annonces de colocation : listings, favoris, candidatures et matches. Node.js/Express + PostgreSQL.

## Demarrage rapide

### Avec Docker

```bash
cd backend/colocations-service
docker-compose up --build -d
```

### Sans Docker

```bash
cd backend/colocations-service
npm install
npm run dev
```

Prerequis : PostgreSQL disponible; definir `.env` (`PORT`, `DATABASE_URL`, `JWT_SECRET`, etc.). Le script `init.sql` initialise le schema.

## Structure

```
colocations-service/
├── server.js
├── routes/colocations.js       # Routes principales
├── controllers/
│   ├── colocationsController.js
│   ├── favoritesController.js
│   ├── applicationsController.js
│   └── matchesController.js
├── middleware/authMiddleware.js
├── config/db.js
├── utils/tokenUtils.js
├── init.sql
└── docker-compose.yml
```

## Endpoints principaux

- `GET /colocations` : lister les annonces
- `GET /colocations/search/location` : filtrer par localisation
- `GET /colocations/:id` : detail d'une annonce
- `POST /colocations` : creer une annonce (JWT)
- `PUT /colocations/:id` : mettre a jour (JWT)
- `DELETE /colocations/:id` : supprimer (JWT)

Favoris (JWT) :
- `GET /colocations/favorites`
- `POST /colocations/:id/favorites`
- `DELETE /colocations/:id/favorites`

Candidatures (JWT) :
- `GET /colocations/applications` : mes candidatures
- `POST /colocations/:id/applications` : postuler
- `GET /colocations/:id/applications` : candidatures sur mon annonce
- `PATCH /colocations/applications/:applicationId` : MAJ statut

Matches (JWT) :
- `GET /colocations/matches` : mes matches
- `GET /colocations/:id/matches` : mon match pour une annonce
- `POST /colocations/:id/matches` : creer/maj mon match
- `DELETE /colocations/:id/matches` : supprimer mon match

## Tests rapides avec curl

```bash
BASE="http://localhost:3002/colocations"
TOKEN="Bearer <votre_token>"

# Lister les annonces publiques
curl "$BASE"

# Ajouter aux favoris
curl -X POST -H "Authorization: $TOKEN" "$BASE/123/favorites"

# Postuler a une annonce
curl -X POST -H "Authorization: $TOKEN" "$BASE/123/applications"
```

## Securite

- JWT requis pour toutes les actions protegees (favoris, candidatures, matches, CRUD protege).
+- Sanitiser les entrees (titres, descriptions) pour prevenir l'injection.
+- Ne pas exposer de secrets dans le code ou les logs.

## Depannage

- **503 via Gateway** : verifier que le service et Postgres sont demarres (`docker-compose ps`).
- **CORS/ports** : s'assurer que la Gateway pointe vers l'URL correcte du service.
- **Donnees manquantes** : rejouer `init.sql` ou recreer la base via Compose.

## Prochaines etapes

- Ajouter des validations de payload (ex. JOI/Zod) et des tests Jest.
- Documenter un `.env.example` pour les variables requises.
