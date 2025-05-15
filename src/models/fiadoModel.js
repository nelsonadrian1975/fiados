// src/models/fiadoModel.js
const { query } = require("../utils/dbUtils");

class FiadoModel {
    /**
     * Obtiene todos los fiados
     * @returns {Promise} - Promesa con el resultado
     */
    static async obtenerTodos() {
        const consulta = `
            SELECT fiados.id, clientes.nombre AS cliente, fiados.monto, 
                fiados.descripcion, fiados.fecha_hora, fiados.saldo
            FROM fiados
            JOIN clientes ON fiados.cliente_id = clientes.id
        `;
        return await query(consulta);
    }

    /**
     * Crea un nuevo fiado
     * @param {number} cliente_id - ID del cliente
     * @param {number} monto - Monto del fiado
     * @param {string} descripcion - Descripción del fiado
     * @returns {Promise} - Promesa con el resultado
     */
    static async crear(cliente_id, monto, descripcion) {
        return await query(
            "INSERT INTO fiados (cliente_id, monto, descripcion, fecha, saldo) VALUES (?, ?, ?, CURDATE(), ?)",
            [cliente_id, monto, descripcion, monto]
        );
    }

    /**
     * Elimina un fiado
     * @param {number} id - ID del fiado a eliminar
     * @returns {Promise} - Promesa con el resultado
     */
    static async eliminar(id) {
        return await query("DELETE FROM fiados WHERE id = ?", [id]);
    }

    /**
     * Actualiza el saldo de fiados de un cliente
     * @param {number} cliente_id - ID del cliente
     * @param {number} monto - Monto a reducir del saldo
     * @returns {Promise} - Promesa con el resultado
     */
    static async actualizarSaldo(cliente_id, monto) {
        return await query(
            "UPDATE fiados SET saldo = saldo - ? WHERE cliente_id = ?",
            [monto, cliente_id]
        );
    }
}

module.exports = FiadoModel;
