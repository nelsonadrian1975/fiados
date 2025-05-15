// src/routes/fiadoRoutes.js
const express = require("express");
const FiadoController = require("../controllers/fiadoController");

const router = express.Router();

// GET - Obtener todos los fiados
router.get("/", FiadoController.obtenerFiados);

// POST - Agregar un fiado
router.post("/", FiadoController.crearFiado);

// DELETE - Eliminar fiado
router.delete("/:id", FiadoController.eliminarFiado);

module.exports = router;
