// src/routes/pagoRoutes.js
const express = require("express");
const PagoController = require("../controllers/pagoController");

const router = express.Router();

// POST - Registrar pagos
router.post("/", PagoController.registrarPago);

module.exports = router;
