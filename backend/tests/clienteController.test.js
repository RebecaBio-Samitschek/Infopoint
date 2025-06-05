const request = require('supertest');
const app = require('../src/app');
const { Cliente, sequelize } = require('../src/models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

describe('Testes de cadastro de cliente', () => {
  const emailTestado = 'cliente_test@teste.com';

  beforeAll(async () => {
    // Remove antes para evitar conflitos
    await Cliente.destroy({ where: { email: emailTestado } });
  });

  it('Deve cadastrar cliente com dados válidos', async () => {
    const res = await request(app).post('/api/clientes').send({
      nome: 'Cliente Teste',
      email: emailTestado,
      senha: '123456',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty(
      'mensagem',
      'Cadastro realizado com sucesso! Verifique seu e-mail para confirmar.'
    );
    expect(res.body.cliente).toHaveProperty('email', emailTestado);
  });

  it('Deve retornar erro se o e-mail já estiver cadastrado', async () => {
    const res = await request(app).post('/api/clientes').send({
      nome: 'Cliente Teste',
      email: emailTestado,
      senha: '123456',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.mensagem).toBe('E-mail já cadastrado.');
  });

  it('Deve retornar erro se campos estiverem vazios', async () => {
    const res = await request(app).post('/api/clientes').send({});

    expect(res.statusCode).toBeGreaterThanOrEqual(400);
    expect(res.body).toHaveProperty('mensagem');
  });

  afterAll(async () => {
    // Remove o cliente de teste para não poluir o banco
    await Cliente.destroy({ where: { email: emailTestado } });
  });
});

describe('Testes de perfil do cliente', () => {
  let token = '';

  beforeAll(async () => {
    const res = await request(app).post('/api/clientes/login').send({
      email: 'usuario@teste.com',
      senha: '123456',
    });

    token = res.body.token;
  });

  it('Deve retornar perfil do cliente autenticado', async () => {
    const res = await request(app)
      .get('/api/clientes/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('email', 'usuario@teste.com');
  });

  it('Deve atualizar o nome do cliente com sucesso', async () => {
    const res = await request(app)
      .put('/api/clientes/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ nome: 'Novo Nome' });

    expect(res.statusCode).toBe(200);
    expect(res.body.cliente).toHaveProperty('nome', 'Novo Nome');
  });
});

describe('Testes de recuperação e redefinição de senha', () => {
  it('Deve enviar e-mail de recuperação para e-mail existente', async () => {
    const res = await request(app)
      .post('/api/clientes/recuperar-senha')
      .send({ email: 'usuario@teste.com' });

    expect(res.statusCode).toBe(200);
    expect(res.body.mensagem).toBe('E-mail de recuperação enviado.');
  });

  it('Deve retornar erro se o e-mail não existir', async () => {
    const res = await request(app)
      .post('/api/clientes/recuperar-senha')
      .send({ email: 'inexistente@teste.com' });

    expect(res.statusCode).toBe(404);
    expect(res.body.mensagem).toBe('E-mail não encontrado.');
  });

  it('Deve redefinir a senha com token válido', async () => {
    const cliente = await Cliente.findOne({ where: { email: 'usuario@teste.com' } });
    const token = jwt.sign({ email: cliente.email }, process.env.JWT_SECRET || 'sua_chave_secreta_segura', {
      expiresIn: '1h',
    });

    const res = await request(app).post('/api/clientes/redefinir-senha').send({
      token,
      novaSenha: 'novaSenha123',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.mensagem).toBe('Senha redefinida com sucesso.');

    // Restaura a senha original
    const senhaHash = await bcrypt.hash('123456', 10);
    cliente.senha = senhaHash;
    await cliente.save();
  });
});

describe('Testes de segurança e confirmação de e-mail', () => {
  it('Deve confirmar o e-mail com um token válido', async () => {
    const cliente = await Cliente.findOne({ where: { email: 'naoconfirmado@teste.com' } });
    if (!cliente) {
      throw new Error('Usuário "naoconfirmado@teste.com" não existe. Crie esse usuário no banco com emailConfirmado = false');
    }

    const token = jwt.sign({ email: cliente.email }, process.env.JWT_SECRET || 'sua_chave_secreta_segura', {
      expiresIn: '1h',
    });

    const res = await request(app).get(`/api/clientes/confirmar-email?token=${token}`);

    expect([200, 400]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('mensagem');
  });

  it('Deve negar acesso ao perfil se não enviar token', async () => {
    const res = await request(app).get('/api/clientes/me');

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('mensagem');
  });

  it('Deve negar acesso ao perfil com token inválido', async () => {
    const res = await request(app)
      .get('/api/clientes/me')
      .set('Authorization', `Bearer token_invalido_123`);

    expect([401, 403]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('mensagem');
  });
});

afterAll(async () => {
  await sequelize.close();
});