// routes/permissoesRoutes.js
const express = require('express');
const router = express.Router();
const permissaoController = require('../controllers/permissaoController');
const auth = require('../middlewares/authMiddleware');

// Todas as rotas protegidas
router.get('/:paginaId', auth, permissaoController.listarPermissoes);
router.post('/:paginaId', auth, permissaoController.adicionarPermissao);
router.delete('/:paginaId/:clienteId', auth, permissaoController.removerPermissao);

module.exports = router;
