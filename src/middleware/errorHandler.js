// src/middleware/errorHandler.js

/**
 * Middleware para manejar errores en la aplicación
 * @param {Error} err - El error capturado
 * @param {Request} req - Objeto de solicitud Express
 * @param {Response} res - Objeto de respuesta Express
 * @param {Function} next - Función para continuar al siguiente middleware
 */
function errorHandler(err, req, res, next) {
  console.error(err.stack);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';
  
  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message
  });
}

module.exports = errorHandler;
