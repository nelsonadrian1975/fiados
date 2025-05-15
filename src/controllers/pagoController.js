// src/controllers/pagoController.js
const PagoModel = require("../models/pagoModel");
const ClienteModel = require("../models/clienteModel");
const FiadoModel = require("../models/fiadoModel");
const { handleError } = require("../middleware/errorHandler");

/**
 * Controlador para manejar pagos
 */
class PagoController {
    /**
     * Registra un nuevo pago
     * @param {Request} req - Objeto de solicitud
     * @param {Response} res - Objeto de respuesta
     */
    static async registrarPago(req, res) {
        const { cliente, monto } = req.body;
        
        if (!cliente || !monto) {
            return res.status(400).json({ error: "❌ Cliente y monto son obligatorios" });
        }

        try {
            // Iniciar transacción para asegurar integridad
            await PagoModel.iniciarTransaccion();
            
            // Obtener ID del cliente
            const resultadoCliente = await ClienteModel.buscarPorNombre(cliente);
            
            if (resultadoCliente.length === 0) {
                await PagoModel.revertirTransaccion();
                return res.status(404).json({ error: "❌ Cliente no encontrado" });
            }

            const cliente_id = resultadoCliente[0].id;

            // Registrar pago
            await PagoModel.registrar(cliente_id, monto);

            // Actualizar saldo en fiados
            await FiadoModel.actualizarSaldo(cliente_id, monto);

            // Confirmar transacción
            await PagoModel.confirmarTransaccion();
            
            res.json({ mensaje: "✅ Pago registrado y saldo actualizado" });
        } catch (err) {
            // Revertir cambios si hay error
            await PagoModel.revertirTransaccion();
            handleError(err, res, "Error al procesar el pago");
        }
    }
}

module.exports = PagoController;
