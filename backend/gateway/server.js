const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
require('dotenv').config();

const proxyRoutes = require('./routes/proxyRoutes');
const { errorHandler } = require('./middleware/errorHandler');
const { rateLimiter } = require('./middleware/rateLimiter');

const app = express();
const PORT = process.env.PORT || 3004;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:3000';

// ============================================
// MIDDLEWARES GLOBAUX
// ============================================

// Sécurité avec helmet
app.use(helmet());

// CORS - Permet les requêtes depuis le frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3004',
  credentials: true
}));

// NE PAS parser le JSON ici car le proxy a besoin du raw body
// app.use(express.json()); 

// Logs HTTP
app.use(morgan('combined'));

// Rate limiting global
app.use(rateLimiter);

// ============================================
// ROUTE DE SANTÉ (HEALTH CHECK)
// ============================================

app.get('/', (req, res) => {
  res.json({
    message: '🚀 API Gateway Toit à Toit',
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
// DÉMARRAGE DU SERVEUR
// ============================================

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════╗
║                                           ║
║       🌐 API GATEWAY ACTIF 🌐            ║
║                                           ║
║  Port: ${PORT}                              ║
║  Environnement: ${process.env.NODE_ENV || 'development'}              ║
║                                           ║
║  Services disponibles:                    ║
║  • Users Service                          ║
║  • Colocations Service                    ║
║  • Messages Service                       ║
║                                           ║
╚═══════════════════════════════════════════╝
  `);
});

// Gestion des erreurs non capturées
process.on('unhandledRejection', (err) => {
  console.error('❌ Erreur non gérée:', err);
  process.exit(1);
});
