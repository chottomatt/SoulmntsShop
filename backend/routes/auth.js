const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../db');

router.post ('/cadastro', async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
        const senha_hash = await bcrypt.hash(senha, 10);

        const resultado = await pool.query(
            `INSERT INTO usuarios (nome, email, senha_hash) VALUES ($1, $2, $3)
            RETURNING id, nome, email`,
            [nome, email, senha_hash]
        );

        res.status(201).json(resultado.rows[0]);
    } catch (erro) {
        if (erro.code === '23505') {
            return res.status(409).json({ erro: 'Este e-mail já foi cadastrado'});
        }
        console.error(erro);
        res.status(500).json({ erro: 'Erro ao cadastrar'});
    }
});

const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    try {
        const resultado = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        const usuario = resultado.rows[0];

        if (!usuario) {
            return res.status(401).json({ erro: 'E-mail ou senha incorretos'});
        }

        const senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash);
        if (!senhaCorreta) {
            return res.status(401).json({ erro: 'E-mail ou senha incorretos' });
        }

        const token = jwt.sign(
            { id: usuario.id, nome: usuario.nome},
            process.env.JWT_SECRET,
            { expiresIn: '7d'}
        );

        res.json({
            token,
            usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email }
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro ao fazer login'});
    }
});

module.exports = router;