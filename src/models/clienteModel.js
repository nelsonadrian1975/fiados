// src/models/clienteModel.js
const { query } = require("../utils/dbUtils");

class ClienteModel {
    /**
     * Busca un cliente por su nombre
     * @param {string} nombre - Nombre del cliente
     * @returns {Promise} - Promesa con el resultado
     */
    static async buscarPorNombre(nombre) {
        return await query("SELECT id FROM clientes WHERE nombre = ?", [nombre]);
    }

    /**
     * Verifica si un teléfono ya está registrado
     * @param {string} telefono - Teléfono a verificar
     * @returns {Promise} - Promesa con el resultado
     */
    static async verificarTelefono(telefono) {
        return await query("SELECT id FROM clientes WHERE telefono = ?", [telefono]);
    }

    /**
     * Crea un nuevo cliente
     * @param {string} nombre - Nombre del cliente
     * @param {string} telefono - Teléfono del cliente
     * @returns {Promise} - Promesa con el resultado
     */
    static async crear(nombre, telefono) {
        return await query("INSERT INTO clientes (nombre, telefono) VALUES (?, ?)", [nombre, telefono]);
    }
}

module.exports = ClienteModel;
