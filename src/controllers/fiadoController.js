// src/controllers/fiadoController.js
const FiadoModel = require("../models/fiadoModel");
const ClienteModel = require("../models/clienteModel");
const { handleError } = require("../middleware/errorHandler");

/**
 * Controlador para manejar fiados
 */
class FiadoController {
    /**
     * Obtiene todos los fiados
     * @param {Request} req - Objeto de solicitud
     * @param {Response} res - Objeto de respuesta
     */
    static async obtenerFiados(req, res) {
        try {
            const resultados = await FiadoModel.obtenerTodos();
            res.json(resultados);
        } catch (err) {
            handleError(err, res, "Error al obtener fiados");
        }
    }

    /**
     * Crea un nuevo fiado
     * @param {Request} req - Objeto de solicitud
     * @param {Response} res - Objeto de respuesta
     */
    static async crearFiado(req, res) {
        const { cliente, monto, descripcion } = req.body;
        
        if (!cliente || !monto) {
            return res.status(400).json({ error: "❌ Cliente y monto son obligatorios" });
        }

        try {
            // Buscar el ID del cliente
            const resultadoCliente = await ClienteModel.buscarPorNombre(cliente);
            
            if (resultadoCliente.length === 0) {
                return res.status(404).json({ error: "❌ Cliente no encontrado en la base de datos" });
            }

            const cliente_id = resultadoCliente[0].id;

            // Insertar el fiado
            await FiadoModel.crear(cliente_id, monto, descripcion);
            
            res.json({ mensaje: "✅ Fiado registrado correctamente" });
        } catch (err) {
            handleError(err, res, "Error al registrar el fiado");
        }
    }

    /**
     * Elimina un fiado
     * @param {Request} req - Objeto de solicitud
     * @param {Response} res - Objeto de respuesta
     */
    static async eliminarFiado(req, res) {
        const { id } = req.params;
        
        try {
            await FiadoModel.eliminar(id);
            res.json({ mensaje: "✅ Fiado eliminado correctamente" });
        } catch (err) {
            handleError(err, res, "Error al eliminar el fiado");
        }
    }
}

module.exports = FiadoController;
