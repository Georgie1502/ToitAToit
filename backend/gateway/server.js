const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const proxyRoutes = require('./routes/proxyRoutes');
const { errorHandler } = require('./middleware/errorHandler');
const { rateLimiter } = require('./middleware/rateLimiter');

const app = express();
const PORT = process.env.PORT || 3000;
const CLIENT_ORIGIN = process.env.FRONTEND_URL || process.env.CLIENT_ORIGIN || 'http://localhost:3004';

// ============================================
// MIDDLEWARES GLOBAUX
// ============================================

// Securite avec helmet
app.use(helmet());

// CORS - Permet les requetes depuis le frontend
app.use(cors({
  origin: CLIENT_ORIGIN,
  credentials: true
}));

// NE PAS parser le JSON ici car le proxy a besoin du raw body
// app.use(express.json()); 

// Logs HTTP
app.use(morgan('combined'));

// Rate limiting global
app.use(rateLimiter);

// ============================================
// ROUTE DE SANTE (HEALTH CHECK)
// ============================================

app.get('/', (req, res) => {
  res.json({
    message: 'API Gateway Toit a Toit',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
    services: {
      users: process.env.USERS_SERVICE_URL || 'http://user-app:3001',
      colocations: process.env.COLOCATIONS_SERVICE_URL || 'http://colocations-app:3002',
      messages: process.env.MESSAGES_SERVICE_URL || 'http://messages-app:3003'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// ============================================
// SWAGGER UI (DEV) - Liste des OpenAPI specs des services
// ============================================

app.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(null, {
    customSiteTitle: 'ToitAToit API Docs',
    swaggerOptions: {
      docExpansion: 'none',
      urls: [
        { url: 'http://localhost:3001/openapi.json', name: 'Users Service' },
        { url: 'http://localhost:3002/openapi.json', name: 'Colocations Service' },
        { url: 'http://localhost:3003/openapi.json', name: 'Messages Service' },
      ],
    },
  }),
);

// ============================================
// ROUTES PROXY VERS LES MICROSERVICES
// ============================================

app.use('/api', proxyRoutes);

// ============================================
// GESTION DES ERREURS 404
// ============================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route introuvable',
    path: req.path
  });
});

// ============================================
// MIDDLEWARE DE GESTION DES ERREURS
// ============================================

app.use(errorHandler);

// ============================================
// DEMARRAGE DU SERVEUR
// ============================================

app.listen(PORT, () => {
  console.log(`
  ============================================
     API GATEWAY ACTIF
  ============================================
  Port: ${PORT}
  Environnement: ${process.env.NODE_ENV || 'development'}
  Services: users | colocations | messages
  ============================================
  `);
});

// Gestion des erreurs non capturees
process.on('unhandledRejection', (err) => {
  console.error('[ERROR] Erreur non geree:', err);
  process.exit(1);
});
