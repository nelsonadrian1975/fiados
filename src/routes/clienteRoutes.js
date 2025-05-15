// src/routes/clienteRoutes.js
const express = require("express");
const ClienteController = require("../controllers/clienteController");

const router = express.Router();

// POST - Agregar un cliente
router.post("/", ClienteController.crearCliente);

module.exports = router;
