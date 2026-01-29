const express = require('express');
const {createProxyMiddleware} = require('http-proxy-middleware');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());    

// Proxy for Users Service
app.use('api/auth', createProxyMiddleware({
    target: 'http://users-service:3001',
    changeOrigin: true,
    pathRewrite: {'^/api/auth': '/auth'},
}));

app.use('/users', createProxyMiddleware({
    target: 'http://users-service:3001',
    changeOrigin: true,
    pathRewrite: {'^/api/users': '/users'},
}));

app.get('/', (req, res) => {
    res.json({message: 'API Gateway Toit à Toit is running'});
});

app.listen(PORT, () => {
    console.log(`API Gateway is running on port ${PORT}`);
});