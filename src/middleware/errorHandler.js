// src/middleware/errorHandler.js

/**
 * Maneja los errores de las rutas
 * @param {Error} err - Error ocurrido
 * @param {Request} req - Objeto de solicitud
 * @param {Response} res - Objeto de respuesta
 * @param {Function} next - Función para pasar al siguiente middleware
 */
function errorHandler(err, req, res, next) {
    console.error(`❌ Error en la aplicación:`, err);
    res.status(500).json({ 
        error: `❌ Error en el servidor`, 
        detalle: err.message 
    });
}

/**
 * Maneja los errores específicos
 * @param {Error} err - Error ocurrido
 * @param {Response} res - Objeto de respuesta
 * @param {string} mensaje - Mensaje personalizado
 */
function handleError(err, res, mensaje) {
    console.error(`❌ ${mensaje}:`, err);
    res.status(500).json({ 
        error: `❌ ${mensaje}`, 
        detalle: err.message 
    });
}

module.exports = {
    errorHandler,
    handleError
};
