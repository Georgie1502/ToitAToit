const { createProxyMiddleware } = require('http-proxy-middleware');
const { SERVICES } = require('../config/services');

/**
 * Crée un proxy middleware configuré pour un service spécifique
 * @param {string} serviceKey - Clé du service (USERS, COLOCATIONS, MESSAGES)
 * @param {string} pathRewrite - Pattern de réécriture du chemin
 */
const createServiceProxy = (serviceKey, pathRewrite = {}) => {
  const service = SERVICES[serviceKey];

  if (!service) {
    throw new Error(`Service ${serviceKey} non trouvé dans la configuration`);
  }

  return createProxyMiddleware({
    target: service.url,
    changeOrigin: true,
    pathRewrite: pathRewrite,
    timeout: service.timeout,
    
    // Logs pour le debugging
    onProxyReq: (proxyReq, req, res) => {
      console.log(`→ Proxy vers ${service.name}: ${req.method} ${req.path}`);
    },
    
    onProxyRes: (proxyRes, req, res) => {
      console.log(`← Réponse de ${service.name}: ${proxyRes.statusCode}`);
    },
    
    onError: (err, req, res) => {
      console.error(`❌ Erreur proxy ${service.name}:`, err.message);
      res.status(503).json({
        success: false,
        message: `Le service ${service.name} est temporairement indisponible`,
        service: service.name
      });
    }
  });
};

/**
 * Vérifie la santé d'un service
 * @param {string} serviceUrl - URL du service à vérifier
 */
const checkServiceHealth = async (serviceUrl) => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(`${serviceUrl}/health`, {
      signal: controller.signal
    });

    clearTimeout(timeout);
    return response.ok;
  } catch (error) {
    return false;
  }
};

/**
 * Vérifie la santé de tous les services
 */
const checkAllServicesHealth = async () => {
  const healthStatus = {};

  for (const [key, service] of Object.entries(SERVICES)) {
    healthStatus[key.toLowerCase()] = {
      name: service.name,
      url: service.url,
      healthy: await checkServiceHealth(service.url)
    };
  }

  return healthStatus;
};

module.exports = {
  createServiceProxy,
  checkServiceHealth,
  checkAllServicesHealth
};
