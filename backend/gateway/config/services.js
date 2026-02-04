require('dotenv').config();

// Configuration des URLs des microservices
const SERVICES = {
  USERS: {
    url: process.env.USERS_SERVICE_URL || 'http://user-app:3001',
    timeout: 5000, // 5 secondes
    name: 'Users Service'
  },
  COLOCATIONS: {
    url: process.env.COLOCATIONS_SERVICE_URL || 'http://colocations-app:3002',
    timeout: 5000,
    name: 'Colocations Service'
  },
  MESSAGES: {
    url: process.env.MESSAGES_SERVICE_URL || 'http://messages-app:3003',
    timeout: 5000,
    name: 'Messages Service'
  }
};

// Configuration CORS
const CORS_OPTIONS = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3004',
  credentials: true,
  optionsSuccessStatus: 200
};

// Configuration rate limiting
const RATE_LIMIT = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limite par IP
  message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard'
};

module.exports = {
  SERVICES,
  CORS_OPTIONS,
  RATE_LIMIT
};
