const express = require('express');
const router = express.Router();
const pool = require('../db');
const autenticar = require('../middlewareAuth');

router.use(autenticar);

router.get('/', async (req, res) => {
    try {
        const resultado = await pool.query(
            'SELECT * FROM enderecos WHERE usuario_id = $1',
            [req.usuario.id]
        );
        res.json(resultado.rows);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro ao buscar endereços' });
    }
});

router.post('/', async (req, res) => {
    const { apelido, 
            cep, 
            rua, 
            numero, 
            complemento, 
            bairro, 
            cidade, 
            estado, 
            principal } = req.body;

    try {
        const resultado = await pool.query(
            `INSERT INTO enderecos (
            usuario_id, 
            apelido, 
            cep,  
            rua, 
            numero, 
            complemento, 
            bairro, 
            cidade, 
            estado, 
            principal) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *`,
            [req.usuario.id, 
            apelido, 
            cep,  
            rua, 
            numero, 
            complemento, 
            bairro, 
            cidade, 
            estado, 
            principal || false]
        );
        res.status(201).json(resultado.rows[0]);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro ao cadastrar endereço' });
    }
});

module.exports = router;