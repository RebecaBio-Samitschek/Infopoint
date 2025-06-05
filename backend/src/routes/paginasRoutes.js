const express = require("express");
const router = express.Router();
const paginaController = require("../controllers/paginaController");
const auth = require("../middlewares/authMiddleware");

// Rotas protegidas
router.post("/", auth, paginaController.criarPagina);
router.get("/cliente", auth, paginaController.listarPaginasPorCliente);
router.put("/:url", auth, paginaController.atualizarPagina);
router.delete("/:id", auth, paginaController.deletarPagina);

// Rota pública para buscar por URL
router.get("/:url", paginaController.buscarPaginaPorUrl);

module.exports = router;
