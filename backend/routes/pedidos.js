const express = require('express');
const router = express.Router();
const pool = require('../db');
const autenticar = require('../middlewareAuth');

router.use(autenticar);

router.post('/', async (req, res) => {
    const { endereco_id } = req.body;
    const cliente = await pool.connect();

    try {
        await cliente.query('BEGIN');

        const itensCarrinho = await cliente.query(
            `SELECT ci.produto_id, ci.quantidade, p.preco, p.nome
            FROM carrinho_itens ci
            JOIN produtos p ON p.id = ci.produto_id
            WHERE ci.usuario_id = $1`,
            [req.usuario.id]
        );
        
        if (itensCarrinho.rows.length === 0) {
            await cliente.query('ROLLBACK');
            return res.status(400).json({erro: 'Carrinho está vazio'});
        }

        const pedido = await cliente.query(
            `INSERT INTO pedidos (usuario_id, endereco_id, valor_total)
            VALUES ($1, $2, $3) RETURNING *`,
            [req.usuario.id, endereco_id, valorTotal]
        );
        const pedidoId = pedido.rows[0].id;

        for (const item of itensCarrinho.rows) {
            await cliente.query(
                `INSERT INTO pedido_itens (pedido_id, produto_id, quantidade, preco_unitario)
                VALUES ($1, $2, $3, $4)`,
                [pedidoId, item.produto_id, item.quantidade, item.preco]
            );
        }

        await cliente.query('DELETE FROM carrinho_itens WHERE usuario_id = $1', [req.usuario.id]);

        await cliente.query('COMMIT');

        res.status(201).json(pedido.rows[0]);
        } catch (erro) {
            await cliente.query('ROLLBACK');
            console.error(erro);
            res.status(500).json({ erro: 'Erro ao criar pedido' });
        } finally {
            cliente.release();
        }
});

router.get('/', async (req, res) => {
    try {
        const resultado = await pool.query (
            'SELECT * FROM pedidos WHERE usuario_id = $1 ORDER BY criado_em DESC',
            [req.usuario.id]
        );
        res.json(resultado.rows);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro ao buscar pedidos' });
    }
});

module.exports = router;