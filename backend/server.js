require('dotenv').config();
const express = require('express');
const cors = require('cors');
const produtosRoutes = require('./routes/produtos');
const authRoutes = require('./routes/auth');
const carrinhoRoutes = require('./routes/carrinho');
const favoritosRoutes = require('./routes/favoritos');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/produtos', produtosRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/carrinho', carrinhoRoutes);
app.use('/api/favoritos', favoritosRoutes);


const PORT = process.env.PORT || 3000;

app. listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});