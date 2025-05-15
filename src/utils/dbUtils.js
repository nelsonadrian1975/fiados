// src/utils/dbUtils.js

/**
 * Ejecuta una consulta SQL con promesas
 * @param {string} sql - La consulta SQL
 * @param {Array} params - Los parámetros para la consulta
 * @returns {Promise} - Promesa con el resultado
 */
function query(sql, params = []) {
    const { conexion } = require("../config/database");
    
    return new Promise((resolve, reject) => {
        conexion.query(sql, params, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
}

module.exports = {
    query
};
