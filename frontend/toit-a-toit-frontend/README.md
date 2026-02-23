# Frontend - Toit a Toit

Application React (CRA) + Tailwind pour la plateforme de colocation. Dialogue avec la Gateway sur `http://localhost:3000/api` en dev.

## Demarrage rapide

### Avec Docker

```bash
cd frontend/toit-a-toit-frontend
docker-compose up --build -d
```

### Sans Docker

```bash
cd frontend/toit-a-toit-frontend
npm install
npm start
```

L'application tourne par defaut sur `http://localhost:3004` (voir `docker-compose.yml`). Mettre a jour `REACT_APP_API_URL` si besoin (ex. `http://localhost:3000/api`).

## Scripts utiles

- `npm start` : mode dev avec hot reload
- `npm test` : tests unitaires (React Testing Library/Jest)
- `npm run build` : build production dans `build/`

## Structure

```

├── App.js / App.css
├── index.js / index.css
├── components/
│   ├── atoms (Button, Input, Logo, Pill)
│   ├── molecules (AuthField, FeatureCard, StatCard)
│   ├── organisms (FeatureGrid, Hero, NavBar)
│   └── templates (AuthLayout, ...)
├── pages/ (Home, Login, Signup, Profile, NotFound)
├── services/ (api.js, auth.js)
└── assets/public/ (manifest, icons)
```

## Configuration API

`src/services/api.js` configure Axios. Definir `REACT_APP_API_URL` pour pointer vers la Gateway (`http://localhost:3000/api`). Les tokens JWT sont ajoutes automatiquement via l'intercepteur.

## Tests rapides

```bash
npm test
```

Pour verifier une page manuellement :
- Gateway en route sur le port 3000
- Frontend sur `http://localhost:3004`

## Bonnes pratiques

- Garder les composants presents/containers simples et reutilisables.
- Utiliser les services Axios pour centraliser les appels API.
- Eviter de stocker des secrets dans le code; utiliser `.env` (ex. `REACT_APP_API_URL`).

## Depannage

- **Erreur CORS/404** : confirmer l'URL de l'API et que la Gateway est demarree.
- **Port deja pris** : changer le port dans `docker-compose.yml` ou `package.json` (scripts start avec `PORT=...`).
- **Styles manquants** : verifier `tailwind.config.js` et `index.css`.
