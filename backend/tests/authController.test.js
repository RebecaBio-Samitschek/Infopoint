const request = require('supertest');
const app = require('../src/app');
const { Cliente, sequelize } = require('../src/models');

describe('Testes de login', () => {

  it('Deve retornar erro se email e senha estiverem ausentes', async () => {
    const res = await request(app).post('/api/clientes/login').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.mensagem).toBe('Campos obrigatórios');
  });

  it('Deve retornar erro se o e-mail não existir', async () => {
    const res = await request(app).post('/api/clientes/login').send({
      email: 'naoexiste@teste.com',
      senha: 'qualquercoisa'
    });
    expect(res.statusCode).toBe(404);
    expect(res.body.mensagem).toBe('Usuário não encontrado.');
  });

  it('Deve retornar erro se o e-mail não estiver confirmado', async () => {
    // Garante que o usuário esteja com emailConfirmado = false
    await Cliente.update(
      { emailConfirmado: false },
      { where: { email: 'naoconfirmado@teste.com' } }
    );

    const res = await request(app).post('/api/clientes/login').send({
      email: 'naoconfirmado@teste.com',
      senha: '123456'
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.mensagem).toBe('Confirme seu e-mail antes de fazer login. Reenviamos o link para sua caixa de entrada.');
  });

  it('Deve retornar erro se a senha estiver incorreta', async () => {
    const res = await request(app).post('/api/clientes/login').send({
      email: 'usuario@teste.com', // usuário válido no bd
      senha: 'senhaerrada'
    });
    expect(res.statusCode).toBe(401);
    expect(res.body.mensagem).toBe('Senha incorreta.');
  });

  it('Deve fazer login com sucesso com credenciais válidas', async () => {
    const res = await request(app).post('/api/clientes/login').send({
      email: 'usuario@teste.com',
      senha: '123456'
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('mensagem', 'Login realizado com sucesso!');
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('clienteId');
    expect(res.body).toHaveProperty('nome');
  });
});

afterAll(async () => {
  await sequelize.close();
});