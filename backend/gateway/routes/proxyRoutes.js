const express = require('express');
const router = express.Router();
const { createServiceProxy, checkAllServicesHealth } = require('../utils/proxyUtils');
const { authRateLimiter } = require('../middleware/rateLimiter');

// ============================================
// ROUTE DE SANTÉ DES SERVICES
// ============================================

router.get('/health', async (req, res) => {
  const servicesHealth = await checkAllServicesHealth();
  
  const allHealthy = Object.values(servicesHealth).every(s => s.healthy);
  
  res.status(allHealthy ? 200 : 503).json({
    success: allHealthy,
    services: servicesHealth,
    timestamp: new Date().toISOString()
  });
});

// ============================================
// USERS SERVICE - Routes d'authentification
// ============================================

router.use('/auth/signup', 
  authRateLimiter, 
  createServiceProxy('USERS', { '^/api/auth': '/auth' })
);

router.use('/auth/login', 
  authRateLimiter, 
  createServiceProxy('USERS', { '^/api/auth': '/auth' })
);

router.use('/auth/logout', 
  createServiceProxy('USERS', { '^/api/auth': '/auth' })
);

// Toutes les autres routes /auth/*
router.use('/auth', 
  createServiceProxy('USERS', { '^/api/auth': '/auth' })
);

// ============================================
// USERS SERVICE - Routes utilisateurs
// ============================================

router.use('/users', 
  createServiceProxy('USERS', { '^/api/users': '/users' })
);

// ============================================
// USERS SERVICE - Routes préférences
// ============================================

router.use('/preferences', 
  createServiceProxy('USERS', { '^/api/preferences': '/api/preferences' })
);

// ============================================
// COLOCATIONS SERVICE
// ============================================

router.use('/colocations', 
  createServiceProxy('COLOCATIONS', { '^/api/colocations': '/api/colocations' })
);

// ============================================
// MESSAGES SERVICE
// ============================================

router.use('/messages', 
  createServiceProxy('MESSAGES', { '^/api/messages': '/api/messages' })
);

// ============================================
// ROUTE CATCH-ALL POUR LES SERVICES NON TROUVÉS
// ============================================

router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint non trouvé',
    path: req.originalUrl,
    availableRoutes: [
      '/api/auth/*',
      '/api/users/*',
      '/api/preferences/*',
      '/api/colocations/*',
      '/api/messages/*'
    ]
  });
});

module.exports = router;
