const rateLimit = require('express-rate-limit');
const { RATE_LIMIT } = require('../config/services');

// Rate limiter global
const rateLimiter = rateLimit({
  windowMs: RATE_LIMIT.windowMs,
  max: process.env.NODE_ENV === 'production' ? RATE_LIMIT.max : 1000,
  message: {
    success: false,
    message: RATE_LIMIT.message
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Rate limiter strict pour les routes d'authentification
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 5 : 100,
  message: {
    success: false,
    message: 'Trop de tentatives de connexion. Veuillez réessayer dans 15 minutes.'
  }
});

module.exports = {
  rateLimiter,
  authRateLimiter
};
