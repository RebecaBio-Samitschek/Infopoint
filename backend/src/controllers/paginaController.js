const { Pagina, Permissao, Cliente } = require('../models');

// Gera URL amigável com base no título
const gerarUrlAmigavel = (titulo) => {
  return titulo.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
};

// Criar nova página
exports.criarPagina = async (req, res) => {
  try {
    const { titulo, layout, dados } = req.body;
    const clienteId = req.clienteId;

    if (!clienteId || !titulo || !layout || !dados) {
      return res.status(400).json({ error: 'Campos obrigatórios não fornecidos.' });
    }

    const url = gerarUrlAmigavel(titulo) + '-' + Math.floor(Math.random() * 10000);

    const novaPagina = await Pagina.create({
      clienteId,
      titulo,
      url,
      layout,
      dados
    });
  
    res.status(201).json(novaPagina);
  } catch (err) {
    console.error('Erro ao criar página:', err);
    res.status(500).json({ error: 'Erro ao criar página.' });
  }
};

// Listar páginas por cliente (criadas e compartilhadas)
exports.listarPaginasPorCliente = async (req, res) => {
  const clienteId = req.clienteId;

  try {
    const minhasPaginas = await Pagina.findAll({ where: { clienteId } });

    const permissoes = await Permissao.findAll({
      where: { clienteId },
      include: {
        model: Pagina,
        as: 'pagina'
      }
    });

    const paginasComPermissao = permissoes.map(p => {
      const pagina = p.pagina.get({ plain: true });
      return { ...pagina, permissao: p.permissao };
    });

    const resultado = [
      ...minhasPaginas.map(p => ({ ...p.get({ plain: true }), permissao: 'dono' })),
      ...paginasComPermissao
    ];

    res.status(200).json(resultado);
  } catch (err) {
    console.error('Erro ao buscar páginas:', err);
    res.status(500).json({ error: 'Erro ao buscar páginas do cliente.' });
  }
};

// Buscar página por URL
exports.buscarPaginaPorUrl = async (req, res) => {
  try {
    let url = req.params.url;

    if (url.startsWith("pagina-personalizada-")) {
      url = url.replace("pagina-personalizada-", "");
    }

    const pagina = await Pagina.findOne({ where: { url } });

    if (!pagina) {
      return res.status(404).json({ error: "Página não encontrada" });
    }

    res.status(200).json(pagina);
  } catch (err) {
    console.error("Erro ao buscar página:", err);
    res.status(500).json({ error: "Erro ao buscar página" });
  }
};

// Atualizar página (dono ou adm/editor)
exports.atualizarPagina = async (req, res) => {
  try {
    const { url } = req.params;
    const { titulo, layout, dados } = req.body;
    const clienteId = req.clienteId;

    const pagina = await Pagina.findOne({ where: { url } });
    if (!pagina) return res.status(404).json({ error: "Página não encontrada" });

    const isDono = pagina.clienteId === clienteId;
    const permissao = await Permissao.findOne({ where: { paginaId: pagina.id, clienteId } });

    if (!isDono && !permissao) {
      return res.status(403).json({ error: "Você não tem permissão para editar esta página." });
    }

    if (!isDono && permissao.permissao !== 'editor' && permissao.permissao !== 'adm') {
      return res.status(403).json({ error: "Você não tem permissão para editar esta página." });
    }

    pagina.titulo = titulo;
    pagina.layout = layout;
    pagina.dados = dados;

    await pagina.save();
    res.status(200).json(pagina);
  } catch (err) {
    console.error("Erro ao atualizar:", err);
    res.status(500).json({ error: "Erro ao atualizar página." });
  }
};

// Deletar página (apenas dono ou adm)
exports.deletarPagina = async (req, res) => {
  try {
    const { id } = req.params;
    const clienteId = req.clienteId;

    const pagina = await Pagina.findByPk(id);
    if (!pagina) {
      return res.status(404).json({ error: "Página não encontrada" });
    }

    const isDono = pagina.clienteId === clienteId;
    const permissao = await Permissao.findOne({ where: { paginaId: pagina.id, clienteId } });

    const isAdm = permissao?.permissao === 'adm';

    if (!isDono && !isAdm) {
      return res.status(403).json({ error: "Você não tem permissão para excluir esta página." });
    }

    await pagina.destroy();
    res.status(200).json({ mensagem: "Página excluída com sucesso" });
  } catch (err) {
    console.error("Erro ao excluir página:", err);
    res.status(500).json({ error: "Erro ao excluir página" });
  }
};
