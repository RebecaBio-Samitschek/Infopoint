const { Cliente } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const enviarEmailConfirmacao = require('../utils/enviarEmailConfirmacao');

const SECRET_KEY = process.env.JWT_SECRET || 'sua_chave_secreta_segura';

exports.login = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ mensagem: 'Campos obrigatórios' });
  }

  try {
    const cliente = await Cliente.findOne({ where: { email } });

    if (!cliente) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
    }

    if (!cliente.emailConfirmado) {
      await enviarEmailConfirmacao(cliente);
      return res.status(200).json({
      reenviado: true,
      mensagem: 'Confirme seu e-mail antes de fazer login. Reenviamos o link para sua caixa de entrada.'
    });
}


    const senhaValida = await bcrypt.compare(senha, cliente.senha);

    if (!senhaValida) {
      return res.status(401).json({ mensagem: 'Senha incorreta.' });
    }

    const token = jwt.sign(
      { id: cliente.id, email: cliente.email },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      mensagem: 'Login realizado com sucesso!',
      token,
      clienteId: cliente.id,
      nome: cliente.nome
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ mensagem: 'Erro no login.' });
  }
};
