const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'sua_chave_secreta_segura';

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ mensagem: 'Token não fornecido.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.clienteId = decoded.id; 
    next();
  } catch (error) {
    return res.status(403).json({ mensagem: 'Token inválido ou expirado.' });
  }
};
