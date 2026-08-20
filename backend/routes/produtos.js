const express = require('express');
const router = express.Router();
const pool = require ('../db');

router.get ('/', async (req, res) => {
    try {
        const resultado = await pool.query(
            `SELECT p.id, 
                    p.nome, 
                    p.descricao, 
                    p.preco, 
                    p.imagem_url, 
                    p.estoque, 
                    c.nome 
                    AS categoria
            FROM produtos p
            LEFT JOIN categorias c ON c.id = p.categoria_id
            WHERE p.ativo = TRUE
            ORDER BY p.criado_em DESC`
        );
        res.json(resultado.rows);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro ao buscar produtos'});
    }
});

module.exports = router;