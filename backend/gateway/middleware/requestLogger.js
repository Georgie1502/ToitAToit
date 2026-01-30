/**
 * Middleware de logging personnalisé pour tracer les requêtes qui passent par la gateway
 */
const requestLogger = (req, res, next) => {
  const start = Date.now();

  // Log après que la réponse soit envoyée
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    const logData = {
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent')
    };

    // Couleur selon le status code
    const statusColor = res.statusCode >= 500 ? '🔴' 
                      : res.statusCode >= 400 ? '🟠'
                      : res.statusCode >= 300 ? '🟡'
                      : '🟢';

    console.log(`${statusColor} [${logData.method}] ${logData.path} → ${logData.statusCode} (${logData.duration})`);
  });

  next();
};

module.exports = { requestLogger };
