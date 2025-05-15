
// app.js
const { app, PORT, HOST } = require("./src/config/server");
require("./src/config/database");

// Iniciar el servidor
app.listen(PORT, HOST, () => {
    console.log(`✅ Servidor corriendo en http://${HOST}:${PORT}`);
});