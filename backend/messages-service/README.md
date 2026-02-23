# Messages Service - Toit a Toit

Service de messagerie entre utilisateurs. Node.js/Express + PostgreSQL, authentifie par JWT.

## Demarrage rapide

### Avec Docker

```bash
cd backend/messages-service
docker-compose up --build -d
```

### Sans Docker

```bash
cd backend/messages-service
npm install
npm run dev
```

Configurer `.env` (`PORT`, `DATABASE_URL`, `JWT_SECRET`, etc.). `init.sql` installe le schema.

## Structure

```
messages-service/
├── server.js
├── routes/messages.js        # /messages
├── controllers/messagesController.js
├── middleware/authMiddleware.js
├── config/db.js
├── utils/tokenUtils.js
├── init.sql
└── docker-compose.yml
```

## Endpoints principaux (JWT requis)

- `GET /messages` : lister mes conversations/messages
- `POST /messages` : envoyer un message
- `GET /messages/:id` : recuperer un message par id

## Tests rapides avec curl

```bash
BASE="http://localhost:3003/messages"
TOKEN="Bearer <votre_token>"

# Lister
curl -H "Authorization: $TOKEN" "$BASE"

# Envoyer
curl -X POST -H "Authorization: $TOKEN" -H "Content-Type: application/json" \
  -d '{"sender_id":1,"receiver_id":2,"content":"Hello"}' "$BASE"
```

## Securite

- Toutes les routes passent par `authMiddleware` (JWT).
- Filtrer/echapper le contenu texte pour limiter l'injection et XSS stocke.
- Masquer les ids sensibles dans les logs.

## Depannage

- **401** : verifier le token et l'en-tete `Authorization`.
- **Connexion DB** : controler `DATABASE_URL` et l'etat du conteneur Postgres.
- **Ports** : ajuster `PORT` si conflit local.

## Prochaines etapes

- Ajouter pagination/filtrage sur `GET /messages`.
- Couvrir les routes par des tests Jest.
- Documenter un `.env.example`.
