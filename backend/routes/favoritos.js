const express = require('express');
const router = express.Router();
const pool = require('../db');
const autenticar = require('../middlewareAuth');

router.use(autenticar);

router.get('/', async (req, res) => {
    try {
        const resultado = await pool.query(
            `SELECT p.id, p.nome, p.preco, p.imagem_url
            FROM favoritos f
            JOIN produtos p ON p.id = f.produto_id
            WHERE f.usuario_id = $1`,
            [req.usuario.id]
        );
        res.json(resultado.rows);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro ao buscar favoritos' });
    }
});

router.post('/', async (req, res) => {
    const { produto_id } = req.body;

    try {
        await pool.query(
            `INSERT INTO favoritos (usuario_id, produto_id) VALUES ($1, $2)
            ON CONFLICT DO NOTHING`,
            [req.usuario.id, produto_id]
        );
        res.status(201).json({ ok: true });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro ao favoritar' });
    }
});

router.delete('/:produto_id', async (req, res) => {
    try {
        await pool.query(
            'DELETE FROM favoritos WHERE usuario_id = $1 AND produto_id = $2',
            [req.usuario.id, req.params.produto_id]
        );
        res.status(204).send();
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro ao desfavoritar' });
    }
})

module.exports = router;
