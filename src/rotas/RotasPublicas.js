const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const AuthController = require('../controllers/AuthController');

const RotasPublicas = express.Router();

RotasPublicas.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const authController = new AuthController();
    
    try {
        // Valida login e senha
        const dados = await authController.login(username, password);
        
        if (dados) {
            // Dados para o payload do token
            const dataToken = {
                id: dados.id,
                email: dados.email,
                username: dados.username,
                exp: Math.floor(Date.now() / 1000) + (60 * 60) // Expira em 1 hora
            };

            // Gera o token JWT
            const token = jwt.sign(dataToken, process.env.APP_KEY_TOKEN);

            return res.json({
                data: dados,
                token: token
            });
        }

        return res.status(401).json({
            message: "Login ou senha incorreto"
        });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({
            message: "Erro interno do servidor"
        });
    }
});

module.exports = RotasPublicas;
