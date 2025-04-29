// server.js
const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Configuração das rotas da API
app.post('/auth/login', (req, res) => {
    const { email, password } = req.body;
    
    // Simulação de autenticação (substitua pela sua lógica real)
    if (email === 'admin@example.com' && password === '123456') {
        res.json({
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkbWluIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
            user: { id: 1, name: 'Admin', email: 'admin@example.com', role: 'admin' }
        });
    } else {
        res.status(401).json({ message: 'Credenciais inválidas' });
    }
});

app.post('/member', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    const { name, email, role } = req.body;
    
    // Verificação do token (simplificada)
    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido' });
    }
    
    // Simulação de criação de membro
    res.json({
        message: 'Membro criado com sucesso',
        member: { id: Math.floor(Math.random() * 1000), name, email, role }
    });
});

app.post('/budget', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    const { title, description, amount, clientId } = req.body;
    
    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido' });
    }
    
    // Simulação de criação de orçamento
    res.json({
        message: 'Orçamento criado com sucesso',
        budget: { 
            id: Math.floor(Math.random() * 1000), 
            title, 
            description, 
            amount, 
            clientId,
            status: 'pending',
            createdAt: new Date().toISOString()
        }
    });
});

app.post('/auth/forgot-password', (req, res) => {
    const { email } = req.body;
    
    // Simulação de envio de código
    res.json({
        message: `Código de redefinição enviado para ${email}`,
        resetToken: 'RESET_' + Math.random().toString(36).substring(2, 15)
    });
});

app.post('/auth/reset-password/:token', (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    
    // Simulação de redefinição de senha
    if (token && password) {
        res.json({ message: 'Senha redefinida com sucesso' });
    } else {
        res.status(400).json({ message: 'Token inválido ou senha não fornecida' });
    }
});

// Rota para servir o arquivo HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}`);
});