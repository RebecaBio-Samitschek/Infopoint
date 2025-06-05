const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');
const auth = require('../middlewares/authMiddleware');

// Cadastro
router.post('/', clienteController.cadastrarCliente);

// Confirmação de e-mail
router.get('/confirmar-email', clienteController.confirmarEmail);

// Rotas protegidas (perfil)
router.get('/me', auth, clienteController.obterPerfil);
router.put('/me', auth, clienteController.atualizarPerfil);
router.delete('/me', auth, clienteController.excluirConta);

// Listagem
router.get('/', clienteController.listarClientes);

module.exports = router;
