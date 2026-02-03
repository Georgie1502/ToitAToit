const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// Inscription d'un nouvel utilisateur
exports.signup = async (req, res) => {  
    try {
        const { username, email, password } = req.body;
        // Vérifier si l'utilisateur existe déjà
        const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }   
        // Hacher le mot de passe
    
        const hashedPassword = await bcrypt.hash(password, 10);
        // Insérer le nouvel utilisateur dans la base de données
        const result  = await pool.query(
            'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
            [username, email, hashedPassword]
        );   
        res.status(201).json({ 
            message: 'User registered successfully'
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });      
    }
};

// Connexion d'un utilisateur existant

exports.login = async (req, res) => {  
    try {
        const { email, password } = req.body;   
        // Vérifier si l'utilisateur existe
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const user = result.rows[0];   
        // Comparer le mot de passe
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Générer un token JWT
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 1000,
        });
        res.json({ user: { username: user.username, email: user.email } });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Deconnexion
exports.logout = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
    });
    res.json({ message: 'Logged out' });
};
