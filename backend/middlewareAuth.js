const jwt = require('jsonwebtoken');

function autenticar(req, res, next) {
    const cabecalho = req.headers['authorization'];
    const token = cabecalho && cabecalho.split(' ')[1];

    if (!token) {
        return res.status(401).json({ erro: 'Faça login para continuar' }); 
    }

    jwt.verify(token, process.env.JWT_SECRET), (erro, dadosUsuario) => {
        if (erro) {
            return res.status(403).json
            ({ erro: 'Sessão expirada, faça login novamente'});
        }
        req.usuario = dadosUsuario;
        next();
    });
}

module.exports = autenticar;