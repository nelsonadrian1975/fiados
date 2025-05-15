const mysql = require("mysql");
const express = require("express");
const cors = require("cors");

// Configuración de Express
const app = express();
app.use(cors());
app.use(express.json());

// Configuración de la base de datos
const dbConfig = {
    host: "localhost",
    user: "root",
    password: "321789",
    database: "fiados"
};

// Crear conexión a la base de datos
const conexion = mysql.createConnection(dbConfig);

// Conectar a la base de datos
conexion.connect(err => {
    if (err) {
        console.error("❌ Error al conectar a la base de datos:", err);
        process.exit(1); // Salir si no se puede conectar a la base de datos
    }
    console.log("✅ Conectado a la base de datos MySQL");
});

/**
 * Ejecuta una consulta SQL con promesas
 * @param {string} sql - La consulta SQL
 * @param {Array} params - Los parámetros para la consulta
 * @returns {Promise} - Promesa con el resultado
 */
function query(sql, params = []) {
    return new Promise((resolve, reject) => {
        conexion.query(sql, params, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
}

/**
 * Maneja los errores de las rutas
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

// ==================== RUTAS API ====================

// GET - Obtener todos los fiados
app.get("/fiados", async (req, res) => {
    const consulta = `
        SELECT fiados.id, clientes.nombre AS cliente, fiados.monto, 
               fiados.descripcion, fiados.fecha_hora, fiados.saldo
        FROM fiados
        JOIN clientes ON fiados.cliente_id = clientes.id
    `;

    try {
        const resultados = await query(consulta);
        res.json(resultados);
    } catch (err) {
        handleError(err, res, "Error al obtener fiados");
    }
});

// POST - Agregar un cliente
app.post("/clientes", async (req, res) => {
    const { nombre, telefono } = req.body;
    
    if (!nombre) {
        return res.status(400).json({ error: "❌ El nombre del cliente es obligatorio" });
    }

    try {
        // Verificar si el teléfono ya existe (si se proporcionó)
        if (telefono && telefono.trim() !== "") {
            const telefonoExistente = await query("SELECT id FROM clientes WHERE telefono = ?", [telefono]);
            if (telefonoExistente.length > 0) {
                return res.status(400).json({ error: "❌ Este teléfono ya está registrado" });
            }
        }

        // Insertar el nuevo cliente
        await query("INSERT INTO clientes (nombre, telefono) VALUES (?, ?)", [nombre, telefono]);
        res.json({ mensaje: "✅ Cliente registrado correctamente" });
    } catch (err) {
        handleError(err, res, "Error al registrar cliente");
    }
});

// POST - Agregar un fiado
app.post("/fiados", async (req, res) => {
    const { cliente, monto, descripcion } = req.body;
    
    if (!cliente || !monto) {
        return res.status(400).json({ error: "❌ Cliente y monto son obligatorios" });
    }

    try {
        // Buscar el ID del cliente
        const resultadoCliente = await query("SELECT id FROM clientes WHERE nombre = ?", [cliente]);
        
        if (resultadoCliente.length === 0) {
            return res.status(404).json({ error: "❌ Cliente no encontrado en la base de datos" });
        }

        const cliente_id = resultadoCliente[0].id;

        // Insertar el fiado
        await query(
            "INSERT INTO fiados (cliente_id, monto, descripcion, fecha, saldo) VALUES (?, ?, ?, CURDATE(), ?)",
            [cliente_id, monto, descripcion, monto]
        );
        
        res.json({ mensaje: "✅ Fiado registrado correctamente" });
    } catch (err) {
        handleError(err, res, "Error al registrar el fiado");
    }
});

// POST - Registrar pagos
app.post("/pagos", async (req, res) => {
    const { cliente, monto } = req.body;
    
    if (!cliente || !monto) {
        return res.status(400).json({ error: "❌ Cliente y monto son obligatorios" });
    }

    try {
        // Iniciar transacción para asegurar integridad
        await query("START TRANSACTION");
        
        // Obtener ID del cliente
        const resultadoCliente = await query("SELECT id FROM clientes WHERE nombre = ?", [cliente]);
        
        if (resultadoCliente.length === 0) {
            await query("ROLLBACK");
            return res.status(404).json({ error: "❌ Cliente no encontrado" });
        }

        const cliente_id = resultadoCliente[0].id;

        // Registrar pago
        await query(
            "INSERT INTO pagos (cliente_id, monto, fecha) VALUES (?, ?, CURDATE())",
            [cliente_id, monto]
        );

        // Actualizar saldo en fiados
        await query(
            "UPDATE fiados SET saldo = saldo - ? WHERE cliente_id = ?",
            [monto, cliente_id]
        );

        // Confirmar transacción
        await query("COMMIT");
        
        res.json({ mensaje: "✅ Pago registrado y saldo actualizado" });
    } catch (err) {
        // Revertir cambios si hay error
        await query("ROLLBACK");
        handleError(err, res, "Error al procesar el pago");
    }
});

// DELETE - Eliminar fiado
app.delete("/fiados/:id", async (req, res) => {
    const { id } = req.params;
    
    try {
        await query("DELETE FROM fiados WHERE id = ?", [id]);
        res.json({ mensaje: "✅ Fiado eliminado correctamente" });
    } catch (err) {
        handleError(err, res, "Error al eliminar el fiado");
    }
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0";

app.listen(PORT, HOST, () => {
    console.log(`✅ Servidor corriendo en http://${HOST}:${PORT}`);
});
