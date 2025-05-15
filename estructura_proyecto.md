# Estructura del Proyecto Fiados

```
fiados/
├── node_modules/            # Módulos de Node.js (generado automáticamente)
├── src/                     # Código fuente principal
│   ├── config/              # Configuraciones
│   │   ├── database.js      # Configuración de la base de datos
│   │   └── server.js        # Configuración del servidor
│   ├── controllers/         # Controladores
│   │   ├── clienteController.js
│   │   ├── fiadoController.js
│   │   └── pagoController.js
│   ├── models/              # Modelos para interactuar con la base de datos
│   │   ├── clienteModel.js
│   │   ├── fiadoModel.js
│   │   └── pagoModel.js
│   ├── routes/              # Rutas de la API
│   │   ├── clienteRoutes.js
│   │   ├── fiadoRoutes.js
│   │   └── pagoRoutes.js
│   ├── utils/               # Utilidades
│   │   └── dbUtils.js       # Funciones para manejar consultas DB
│   └── middleware/          # Middlewares
│       └── errorHandler.js  # Manejo de errores
├── public/                  # Archivos estáticos
│   ├── css/                 # Estilos CSS
│   ├── js/                  # JavaScript del cliente
│   │   └── main.js          # Lógica del cliente
│   └── index.html           # Página principal
├── app.js                   # Punto de entrada principal
└── package.json             # Dependencias y scripts
```