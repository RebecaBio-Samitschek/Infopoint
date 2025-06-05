const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController'); // login
const clienteController = require('../controllers/clienteController'); // demais
const auth = require('../middlewares/authMiddleware');

// Login
router.post('/login', authController.login);

// Cadastro e confirmação
router.post('/', clienteController.cadastrarCliente);
router.get('/confirmar-email', clienteController.confirmarEmail);

// Recuperação de senha
router.post('/recuperar-senha', clienteController.enviarRecuperacaoSenha);
router.post('/redefinir-senha', clienteController.redefinirSenha);

// Protegidas
router.get('/me', auth, clienteController.obterPerfil);
router.put('/me', auth, clienteController.atualizarPerfil);
router.delete('/me', auth, clienteController.excluirConta);

// Listagem
router.get('/', clienteController.listarClientes);

module.exports = router;
