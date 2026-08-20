require('dotenv').config();
const express = require('express');
const cors = require('cors');
const produtosRoutes = require('./routes/produtos');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/produtos', produtosRoutes);

const PORT = process.env.PORT || 3000;

app. listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});