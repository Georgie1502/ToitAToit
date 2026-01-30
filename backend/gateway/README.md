# API Gateway - Toit à Toit

## 🎯 Rôle de l'API Gateway

L'API Gateway est le **point d'entrée unique** de votre architecture microservices. Elle centralise toutes les requêtes du frontend et les redistribue aux bons microservices.

### Avantages
✅ **Point d'entrée unique** - Le frontend n'a qu'une seule URL à connaître  
✅ **Sécurité centralisée** - Rate limiting, CORS, authentification  
✅ **Simplicité** - Pas besoin de gérer plusieurs URLs côté frontend  
✅ **Monitoring** - Tous les logs passent par un seul endroit  
✅ **Evolutivité** - Ajout de services sans modifier le frontend  

## 🏗️ Architecture

```
Frontend (React)
    ↓
API Gateway :3000
    ↓
    ├─→ Users Service :3001
    ├─→ Colocations Service :3002
    └─→ Messages Service :3003
```

## 📂 Structure du projet

```
gateway/
├── config/
│   └── services.js          # Configuration des microservices
├── middleware/
│   ├── errorHandler.js      # Gestion des erreurs
│   ├── rateLimiter.js       # Limitation du taux de requêtes
│   └── requestLogger.js     # Logs personnalisés
├── routes/
│   └── proxyRoutes.js       # Définition des routes proxy
├── utils/
│   └── proxyUtils.js        # Utilitaires pour le proxy
├── server.js                # Point d'entrée
├── .env.example             # Variables d'environnement
├── Dockerfile
├── docker-compose.yml
└── package.json
```

## 🚀 Installation

### 1. Copier les fichiers
Placez tous les fichiers dans votre dossier `backend/gateway/`

### 2. Créer le fichier .env
```bash
cp .env.example .env
```

### 3. Installer les dépendances
```bash
npm install
```

### 4. Démarrer avec Docker

**Option A : Avec docker-compose (recommandé)**
```bash
docker-compose up --build -d
```

**Option B : Sans Docker (développement local)**
```bash
npm run dev
```

## 📡 Routes disponibles

### Routes de santé
- `GET /` - Informations sur la gateway
- `GET /health` - Statut de santé
- `GET /api/health` - Santé de tous les services

### Routes vers Users Service
- `POST /api/auth/signup` - Inscription (rate limited)
- `POST /api/auth/login` - Connexion (rate limited)
- `POST /api/auth/logout` - Déconnexion
- `GET /api/users/profile` - Profil utilisateur
- `GET /api/users` - Liste des utilisateurs
- `GET /api/users/:id` - Utilisateur par ID
- `PUT /api/users/:id` - Modifier utilisateur
- `DELETE /api/users/:id` - Supprimer utilisateur
- `GET /api/preferences` - Préférences utilisateur
- `POST /api/preferences` - Créer/modifier préférences
- `DELETE /api/preferences` - Supprimer préférences

### Routes vers Colocations Service
- `GET /api/colocations` - Liste des colocations
- `GET /api/colocations/:id` - Colocation par ID
- `POST /api/colocations` - Créer une colocation
- `PUT /api/colocations/:id` - Modifier une colocation
- `DELETE /api/colocations/:id` - Supprimer une colocation
- `GET /api/colocations/search/location` - Recherche par localisation

### Routes vers Messages Service
- `GET /api/messages` - Liste des messages
- `POST /api/messages` - Envoyer un message
- `GET /api/messages/:id` - Message par ID

## 🔧 Configuration

### Variables d'environnement (.env)

```env
# Port de la Gateway
PORT=3000

# Environnement
NODE_ENV=development

# URL du frontend (pour CORS)
FRONTEND_URL=http://localhost:3004

# URLs des microservices
USERS_SERVICE_URL=http://user-app:3001
COLOCATIONS_SERVICE_URL=http://colocations-app:3002
MESSAGES_SERVICE_URL=http://messages-app:3003
```

### Modifier les URLs des services

Dans `config/services.js`, vous pouvez ajuster :
- Les URLs des services
- Les timeouts
- Les noms affichés

## 🛡️ Sécurité

### Rate Limiting

**Global** : 100 requêtes / 15 minutes par IP

**Authentification** : 5 tentatives / 15 minutes par IP

Configuration dans `middleware/rateLimiter.js`

### CORS

Configuré pour accepter uniquement les requêtes depuis le frontend défini dans `.env`

### Helmet

Protection contre les vulnérabilités web communes

## 📊 Monitoring et Logs

### Logs HTTP
La gateway utilise Morgan pour logger toutes les requêtes :
```
🟢 [GET] /api/users/profile → 200 (45ms)
🔴 [POST] /api/auth/login → 500 (120ms)
```

### Health Check
```bash
# Vérifier la santé de la gateway
curl http://localhost:3000/health

# Vérifier la santé de tous les services
curl http://localhost:3000/api/health
```

Réponse :
```json
{
  "success": true,
  "services": {
    "users": {
      "name": "Users Service",
      "url": "http://user-app:3001",
      "healthy": true
    },
    "colocations": {
      "name": "Colocations Service",
      "url": "http://colocations-app:3002",
      "healthy": true
    },
    "messages": {
      "name": "Messages Service",
      "url": "http://messages-app:3003",
      "healthy": false
    }
  }
}
```

## 🧪 Tests

### Tester la gateway
```bash
# Health check
curl http://localhost:3000/health

# Inscription via gateway
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.com",
    "password": "123456",
    "name": "Test User",
    "age": 25,
    "gender": "Homme"
  }'

# Connexion via gateway
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.com",
    "password": "123456"
  }'
```

## 🔄 Gestion des erreurs

### Erreurs gérées automatiquement

- **503 Service Unavailable** : Le microservice est down
- **504 Gateway Timeout** : Le microservice a mis trop de temps à répondre
- **429 Too Many Requests** : Rate limit atteint
- **404 Not Found** : Route inexistante

### Exemple de réponse d'erreur
```json
{
  "success": false,
  "message": "Le service Users Service est temporairement indisponible",
  "service": "Users Service"
}
```

## 🐳 Docker

### Démarrer
```bash
docker-compose up --build -d
```

### Voir les logs
```bash
docker-compose logs -f gateway
```

### Arrêter
```bash
docker-compose down
```

### Reconstruire après modification
```bash
docker-compose up --build
```

## 🔗 Intégration avec le frontend

Dans votre frontend React, configurez Axios :

```javascript
// services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/api'
});

// Intercepteur pour ajouter le token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
```

Utilisation :
```javascript
// Inscription
await API.post('/auth/signup', userData);

// Connexion
const response = await API.post('/auth/login', credentials);

// Profil (avec token automatique)
const profile = await API.get('/users/profile');
```

## 🚨 Dépannage

### Problème : Gateway ne démarre pas
**Solution** : Vérifiez que le réseau Docker existe
```bash
docker network create users-service_app-network
```

### Problème : 503 Service Unavailable
**Solution** : Vérifiez que les microservices sont bien démarrés
```bash
docker ps
curl http://localhost:3001/health  # Users service
```

### Problème : CORS errors
**Solution** : Vérifiez que `FRONTEND_URL` dans `.env` correspond à l'URL de votre frontend

### Problème : Timeout
**Solution** : Augmentez le timeout dans `config/services.js`

## 📚 Prochaines étapes

1. ✅ Gateway fonctionnelle avec rate limiting
2. 🔄 Ajouter l'authentification JWT au niveau gateway
3. 🔄 Ajouter un cache Redis pour améliorer les performances
4. 🔄 Implémenter le circuit breaker pattern
5. 🔄 Ajouter des métriques Prometheus

## 💡 Bonnes pratiques

- ✅ Toujours utiliser la gateway comme point d'entrée
- ✅ Ne jamais exposer directement les microservices
- ✅ Monitorer la santé des services régulièrement
- ✅ Configurer des timeouts appropriés
- ✅ Implémenter le rate limiting pour éviter les abus
- ✅ Logger toutes les requêtes pour le debugging

---

🏠 **Toit à Toit** - API Gateway v1.0.0
