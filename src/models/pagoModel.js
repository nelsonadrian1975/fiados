// src/models/pagoModel.js
const { query } = require("../utils/dbUtils");

class PagoModel {
    /**
     * Registra un nuevo pago
     * @param {number} cliente_id - ID del cliente
     * @param {number} monto - Monto del pago
     * @returns {Promise} - Promesa con el resultado
     */
    static async registrar(cliente_id, monto) {
        return await query(
            "INSERT INTO pagos (cliente_id, monto, fecha) VALUES (?, ?, CURDATE())",
            [cliente_id, monto]
        );
    }

    /**
     * Inicia una transacción
     * @returns {Promise} - Promesa con el resultado
     */
    static async iniciarTransaccion() {
        return await query("START TRANSACTION");
    }

    /**
     * Confirma una transacción
     * @returns {Promise} - Promesa con el resultado
     */
    static async confirmarTransaccion() {
        return await query("COMMIT");
    }

    /**
     * Revierte una transacción
     * @returns {Promise} - Promesa con el resultado
     */
    static async revertirTransaccion() {
        return await query("ROLLBACK");
    }
}

module.exports = PagoModel;