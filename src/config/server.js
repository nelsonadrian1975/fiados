// src/config/server.js
const express = require("express");
const cors = require("cors");
const path = require("path");
const clienteRoutes = require("../routes/clienteRoutes");
const fiadoRoutes = require("../routes/fiadoRoutes");
const pagoRoutes = require("../routes/pagoRoutes");
const errorHandler = require("../middleware/errorHandler");

// Configuración de Express
const app = express();
app.use(cors());
app.use(express.json());

// Servir archivos estáticos desde la carpeta public
app.use(express.static(path.join(__dirname, "../../public")));

// Configurar rutas
app.use("/clientes", clienteRoutes);
app.use("/fiados", fiadoRoutes);
app.use("/pagos", pagoRoutes);

// Middleware para manejar errores
app.use(errorHandler);

// Configuración del puerto y host
const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0";

module.exports = {
    app,
    PORT,
    HOST
};