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

module.exports = router;