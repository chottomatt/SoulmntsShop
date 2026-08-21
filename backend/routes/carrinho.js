const express = require('express');
const router = express.Router();
const pool = require ('../db');
const autenticar = require ('../middlewareAuth');

router.use(autenticar);

router.get ('/', async (req, res) => {
    try {
        const resultado = await pool.query(
            `SELECT ci.id, ci.quantidade, p.id AS produto_id, p.nome, p.preco, p.imagem_url
            FROM carrinho_itens ci
            JOIN produtos p ON p.id = ci.produto_id
            WHERE ci.usuario_id = $1`,
            [req.usuario.id]
        );
        res.json(resultado.rows);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro ao buscar carrinho'});
    }
});
router.post('/', async (req, res) => {
    const { produto_id, quantidade } = req.body;

    try {
        const resultado = await pool.query(
            `INSERT INTO carrinho_itens (usuario_id, produto_id, quantidade)
             VALUES ($1, $2, $3)
             ON CONFLICT (usuario_id, produto_id)
             DO UPDATE SET quantidade = carrinho_itens.quantidade + $3
             RETURNING *`,
            [req.usuario.id, produto_id, quantidade || 1]
        );
        res.status(201).json(resultado.rows[0]);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro ao adicionar ao carrinho' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await pool.query(
            'DELETE FROM carrinho_itens WHERE id = $1 AND usuario_id = $2',
            [req.params.id, req.usuario.id]
        );
        res.status(204).send();
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro ao remover item' });
    }
});
module.exports = router;