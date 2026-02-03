const express = require('express');
const {createProxyMiddleware} = require('http-proxy-middleware');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3004;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:3000';

// Middlewares
app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(morgan('dev'));

const addAuthPrefix = (path) => `/auth${path}`;
const addUsersPrefix = (path) => `/users${path}`;

// Proxy for Users Service
app.use('/api/auth', createProxyMiddleware({
    target: 'http://user-app:3001',
    changeOrigin: true,
    pathRewrite: addAuthPrefix,
}));

app.use('/api/users', createProxyMiddleware({
    target: 'http://user-app:3001',
    changeOrigin: true,
    pathRewrite: addUsersPrefix,
}));

app.use(express.json());

app.get('/', (req, res) => {
    res.json({message: 'API Gateway Toit à Toit is running'});
});

app.listen(PORT, () => {
    console.log(`API Gateway is running on port ${PORT}`);
});
