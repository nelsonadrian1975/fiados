// src/config/database.js
const mysql = require("mysql");

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

module.exports = {
    conexion
};