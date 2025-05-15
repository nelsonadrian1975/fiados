// src/controllers/clienteController.js
const ClienteModel = require("../models/clienteModel");
const { handleError } = require("../middleware/errorHandler");

/**
 * Controlador para manejar clientes
 */
class ClienteController {
    /**
     * Crea un nuevo cliente
     * @param {Request} req - Objeto de solicitud
     * @param {Response} res - Objeto de respuesta
     */
    static async crearCliente(req, res) {
        const { nombre, telefono } = req.body;
        
        if (!nombre) {
            return res.status(400).json({ error: "❌ El nombre del cliente es obligatorio" });
        }

        try {
            // Verificar si el teléfono ya existe (si se proporcionó)
            if (telefono && telefono.trim() !== "") {
                const telefonoExistente = await ClienteModel.verificarTelefono(telefono);
                if (telefonoExistente.length > 0) {
                    return res.status(400).json({ error: "❌ Este teléfono ya está registrado" });
                }
            }

            // Insertar el nuevo cliente
            await ClienteModel.crear(nombre, telefono);
            res.json({ mensaje: "✅ Cliente registrado correctamente" });
        } catch (err) {
            handleError(err, res, "Error al registrar cliente");
        }
    }
}

module.exports = ClienteController;
