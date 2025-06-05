const Cliente = require('../models/Cliente');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const enviarEmailConfirmacao = require('../utils/enviarEmailConfirmacao');
const enviarEmailRecuperacao = require('../utils/enviarEmailRecuperacao');


// Cadastro de cliente
exports.cadastrarCliente = async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    const clienteExistente = await Cliente.findOne({ where: { email } });
    if (clienteExistente) {
      return res.status(400).json({ mensagem: "E-mail já cadastrado." });
    }

    const hashedPassword = await bcrypt.hash(senha, 10);

    const novoCliente = await Cliente.create({
      nome,
      email,
      senha: hashedPassword,
    });

    // Envia e-mail de confirmação
    await enviarEmailConfirmacao(novoCliente);

    res.status(201).json({
      mensagem: 'Cadastro realizado com sucesso! Verifique seu e-mail para confirmar.',
      cliente: {
        id: novoCliente.id,
        nome: novoCliente.nome,
        email: novoCliente.email
      }
    });
  } catch (error) {
    console.error('Erro ao cadastrar:', error);
    res.status(500).json({ mensagem: 'Erro ao cadastrar cliente.' });
  }
};

// Rota para confirmar e-mail
exports.confirmarEmail = async (req, res) => {
  const { token } = req.query;

  console.log('SEGREDO JWT ATUAL:', process.env.JWT_SECRET);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token decodificado:", decoded);

    const cliente = await Cliente.findOne({ where: { email: decoded.email } });

    if (!cliente) {
      return res.status(404).json({ mensagem: 'Cliente não encontrado.' });
    }

    if (cliente.emailConfirmado) {
      return res.status(400).json({ mensagem: 'E-mail já confirmado.' });
    }

    cliente.emailConfirmado = true;
    await cliente.save();

    res.status(200).json({ mensagem: 'E-mail confirmado com sucesso!' });
  } catch (error) {
    console.error('Erro na confirmação de e-mail:', error);
    res.status(400).json({ mensagem: 'Link inválido ou expirado.' });
  }
};

// Obter dados do cliente logado
exports.obterPerfil = async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.clienteId, {
      attributes: { exclude: ['senha'] }
    });

    if (!cliente) {
      return res.status(404).json({ mensagem: 'Cliente não encontrado.' });
    }

    res.status(200).json(cliente);
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    res.status(500).json({ mensagem: 'Erro ao buscar perfil.' });
  }
};

// Atualiza perfil do cliente logado
exports.atualizarPerfil = async (req, res) => {
  const clienteId = req.clienteId;
  const { nome, senhaAtual, novaSenha } = req.body;

  try {
    const cliente = await Cliente.findByPk(clienteId);
    if (!cliente) {
      return res.status(404).json({ mensagem: 'Cliente não encontrado.' });
    }

    if (!nome || nome.trim() === "") {
      return res.status(400).json({ mensagem: 'Nome é obrigatório.' });
    }

    if (senhaAtual || novaSenha) {
      if (!senhaAtual || !novaSenha) {
        return res.status(400).json({ mensagem: 'Para alterar a senha, preencha todos os campos.' });
      }

      const senhaCorreta = await bcrypt.compare(senhaAtual, cliente.senha);
      if (!senhaCorreta) {
        return res.status(401).json({ mensagem: 'Senha atual incorreta.' });
      }

      const mesmaSenha = await bcrypt.compare(novaSenha, cliente.senha);
      if (mesmaSenha) {
        return res.status(400).json({ mensagem: 'A nova senha deve ser diferente da atual.' });
      }

      const novaSenhaHash = await bcrypt.hash(novaSenha, 10);
      cliente.senha = novaSenhaHash;
    }

    cliente.nome = nome;
    await cliente.save();

    res.status(200).json({
      mensagem: 'Perfil atualizado com sucesso.',
      cliente: {
        id: cliente.id,
        nome: cliente.nome,
        email: cliente.email
      }
    });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({ mensagem: 'Erro ao atualizar perfil.' });
  }
};

// Excluir conta do cliente logado
exports.excluirConta = async (req, res) => {
  const clienteId = req.clienteId;
  const { senhaAtual } = req.body;

  try {
    const cliente = await Cliente.findByPk(clienteId);

    if (!cliente) {
      return res.status(404).json({ mensagem: "Cliente não encontrado." });
    }

    if (!senhaAtual) {
      return res.status(400).json({ mensagem: "Informe sua senha atual para confirmar." });
    }

    const senhaCorreta = await bcrypt.compare(senhaAtual, cliente.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ mensagem: "Senha incorreta. Conta não excluída." });
    }

    await cliente.destroy();

    res.status(200).json({ mensagem: "Conta excluída com sucesso." });
  } catch (error) {
    console.error("Erro ao excluir conta:", error);
    res.status(500).json({ mensagem: "Erro ao excluir conta." });
  }
};

// Listar todos os clientes
exports.listarClientes = async (req, res) => {
  try {
    const clientes = await Cliente.findAll();
    res.status(200).json(clientes);
  } catch (error) {
    console.error('Erro ao listar clientes:', error);
    res.status(500).json({ mensagem: 'Erro ao buscar clientes.' });
  }
};


// Envia e-mail para recuperação de senha
exports.enviarRecuperacaoSenha = async (req, res) => {
  const { email } = req.body;

  try {
    const cliente = await Cliente.findOne({ where: { email } });

    if (!cliente) {
      return res.status(404).json({ mensagem: 'E-mail não encontrado.' });
    }

    await enviarEmailRecuperacao(cliente);

    res.status(200).json({ mensagem: 'E-mail de recuperação enviado.' });
  } catch (error) {
    console.error('Erro ao enviar recuperação de senha:', error);
    res.status(500).json({ mensagem: 'Erro ao processar solicitação.' });
  }
};

// Redefine a senha
exports.redefinirSenha = async (req, res) => {
  const { token, novaSenha } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const cliente = await Cliente.findOne({ where: { email: decoded.email } });

    if (!cliente) {
      return res.status(404).json({ mensagem: 'Cliente não encontrado.' });
    }

    const novaSenhaHash = await bcrypt.hash(novaSenha, 10);
    cliente.senha = novaSenhaHash;
    await cliente.save();

    res.status(200).json({ mensagem: 'Senha redefinida com sucesso.' });
  } catch (error) {
    console.error('Erro ao redefinir senha:', error);
    res.status(400).json({ mensagem: 'Token inválido ou expirado.' });
  }
};