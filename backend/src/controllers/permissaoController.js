const Permissao = require('../models/Permissao');
const Cliente = require('../models/Cliente');
const Pagina = require('../models/Pagina');

// Função auxiliar para verificar se o cliente é dono ou adm
const verificarAutorizacao = async (clienteId, paginaId) => {
  const pagina = await Pagina.findByPk(paginaId);
  const permissao = await Permissao.findOne({ where: { clienteId, paginaId } });

  const isDono = pagina?.clienteId === clienteId;
  const isAdm = permissao?.permissao === 'adm';

  return isDono || isAdm;
};

// Adicionar permissão a um usuário
exports.adicionarPermissao = async (req, res) => {
  try {
    const { paginaId } = req.params;
    const { email, permissao } = req.body;

    const autorizado = await verificarAutorizacao(req.clienteId, paginaId);
    if (!autorizado) {
      return res.status(403).json({ mensagem: "Acesso negado à gestão de permissões." });
    }

    const cliente = await Cliente.findOne({ where: { email } });
    if (!cliente) return res.status(404).json({ mensagem: "Usuário não encontrado." });

    const existente = await Permissao.findOne({
      where: { clienteId: cliente.id, paginaId }
    });

    if (existente) {
      return res.status(400).json({ mensagem: "Usuário já possui permissão nessa página." });
    }

    const novaPermissao = await Permissao.create({
      clienteId: cliente.id,
      paginaId,
      permissao
    });

    res.status(201).json(novaPermissao);
  } catch (err) {
    console.error("Erro ao adicionar permissão:", err);
    res.status(500).json({ mensagem: "Erro ao adicionar permissão." });
  }
};

// Listar permissões de uma página
exports.listarPermissoes = async (req, res) => {
  try {
    const { paginaId } = req.params;

    const autorizado = await verificarAutorizacao(req.clienteId, paginaId);
    if (!autorizado) {
      return res.status(403).json({ mensagem: "Acesso negado à gestão de permissões." });
    }

    const permissoes = await Permissao.findAll({
      where: { paginaId },
      include: [{ model: Cliente, as: 'cliente', attributes: ['id', 'nome', 'email'] }]
    });

    // Enviando uma lista mais limpa para o frontend
    const lista = permissoes.map(p => ({
      id: p.id,
      clienteId: p.clienteId,
      email: p.cliente.email,
      nome: p.cliente.nome,
      permissao: p.permissao
    }));

    res.status(200).json(lista);
  } catch (err) {
    console.error("Erro ao listar permissões:", err);
    res.status(500).json({ mensagem: "Erro ao listar permissões." });
  }
};

// Remover permissão
exports.removerPermissao = async (req, res) => {
  try {
    const { paginaId, clienteId } = req.params;

    const autorizado = await verificarAutorizacao(req.clienteId, paginaId);
    if (!autorizado) {
      return res.status(403).json({ mensagem: "Acesso negado à gestão de permissões." });
    }

    const permissao = await Permissao.findOne({ where: { paginaId, clienteId } });

    if (!permissao) {
      return res.status(404).json({ mensagem: "Permissão não encontrada." });
    }

    await permissao.destroy();
    res.status(200).json({ mensagem: "Permissão removida com sucesso." });
  } catch (err) {
    console.error("Erro ao remover permissão:", err);
    res.status(500).json({ mensagem: "Erro ao remover permissão." });
  }
};
