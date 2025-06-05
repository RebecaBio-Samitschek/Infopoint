const request = require('supertest');
const app = require('../src/app');
const { Cliente, Pagina, Permissao, sequelize } = require('../src/models');
const jwt = require('jsonwebtoken');

let token;
let clienteId;

beforeAll(async () => {
  // Busca um cliente existente (ex: usuario@teste.com)
  const cliente = await Cliente.findOne({ where: { email: 'usuario@teste.com' } });
  clienteId = cliente.id;

  token = jwt.sign({ id: cliente.id, email: cliente.email }, process.env.JWT_SECRET || 'InfopointSuperSeguro123');

  // Remove páginas do cliente (limpa antes de testar)
  await Pagina.destroy({ where: { clienteId } });
});

describe('Página - Testes de criação, listagem e busca', () => {
  it('Deve criar uma nova página', async () => {
    const res = await request(app)
      .post('/api/paginas')
      .set('Authorization', `Bearer ${token}`)
      .send({
        titulo: 'Página Teste',
        layout: 'saude',
        dados: { texto: 'Conteúdo teste' }
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('url');
    expect(res.body.titulo).toBe('Página Teste');
  });

  it('Deve listar páginas (pode ser lista vazia ou com itens)', async () => {
    const res = await request(app)
      .get('/api/paginas/cliente')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('Deve buscar uma página por URL', async () => {
    const pagina = await Pagina.findOne({ where: { clienteId } });

    const res = await request(app)
      .get(`/api/paginas/${pagina.url}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('titulo', pagina.titulo);
  });
});

describe('Página - Atualização e Exclusão', () => {
  let paginaId;
  let paginaUrl;

  beforeAll(async () => {
    const novaPagina = await Pagina.create({
      clienteId,
      titulo: 'Página Atualizar',
      url: 'pagina-atualizar-' + Math.floor(Math.random() * 10000),
      layout: 'personalizado',
      dados: { texto: 'Original' }
    });

    paginaId = novaPagina.id;
    paginaUrl = novaPagina.url;

    await Permissao.create({
      clienteId,
      paginaId: novaPagina.id,
      permissao: 'adm'
    });
  });

  it('Deve atualizar uma página existente', async () => {
    const res = await request(app)
      .put(`/api/paginas/${paginaUrl}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        titulo: 'Página Atualizada',
        layout: 'personalizado',
        dados: { texto: 'Conteúdo atualizado' }
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('titulo', 'Página Atualizada');
  });

  it('Deve excluir uma página existente', async () => {
    const res = await request(app)
      .delete(`/api/paginas/${paginaId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('mensagem', 'Página excluída com sucesso');
  });
});

afterAll(async () => {
  await sequelize.close(); // fecha conexão
});
