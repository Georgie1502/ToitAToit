const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const preferencesRoutes = require('./routes/preferences');
const createOpenApiSpec = require('./docs/openapi');

const app = express();
const PORT = process.env.PORT || 3001;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || process.env.FRONTEND_URL || 'http://localhost:3004';

// Middlewares
app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(morgan('dev'));
app.use(express.json());

app.get('/health', async (req, res) => {
    const start = Date.now();
    try {
        const pool = require('./config/db');
        await pool.query('SELECT 1');
        res.json({
            status: 'healthy',
            service: 'users-service',
            db: 'connected',
            responseTime: `${Date.now() - start}ms`,
            timestamp: new Date().toISOString(),
        });
    } catch (err) {
        res.status(503).json({
            status: 'degraded',
            service: 'users-service',
            db: 'disconnected',
            error: err.message,
            timestamp: new Date().toISOString(),
        });
    }
});

// OpenAPI / Swagger UI
app.get('/openapi.json', (req, res) => res.json(createOpenApiSpec(req)));
app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(null, { swaggerOptions: { url: '/openapi.json' } }),
);

// Routes
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes); // Added this line to fix the issue
app.use('/users', userRoutes);
app.use('/api/preferences', preferencesRoutes);

// Optional aliases (useful without the gateway)
app.use('/preferences', preferencesRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${process.env.PORT || 3001}`);
});
