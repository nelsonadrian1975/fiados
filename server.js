// server.js
const express = require('express');
const path = require('path');
const app = express();
const clientesRoutes = require('./routes/clientes');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/clientes', clientesRoutes);

app.get('/', (req, res) => {
  res.redirect('/clientes');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor iniciado en puerto ${PORT}`));
