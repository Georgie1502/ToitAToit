import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography } from '@mui/material';
import api from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault(); 
        try {
            const response = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            navigate('/profile');   
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');        
        }   
    };

    return (    
        <Container maxWidth="sm">
            <Typography variant="h4" align="center" gutterBottom>
                Connexion </Typography>
            <form onSubmit={handleLogin}>
                        <TextField fullWidth label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextField fullWidth type="password" label="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button type="submit" variant="contained">Se connecter</Button>
      </form>
    </Container>
    );
};

export default Login;