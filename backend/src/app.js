const express = require('express');
const cors = require('cors');
const app = express();

const clienteRoutes = require('./routes/authRoutes');
const paginasRoutes = require('./routes/paginasRoutes');
const permissoesRoutes = require('./routes/permissoesRoutes');

app.use(cors());
app.use(express.json());

app.use('/api/clientes', clienteRoutes);  
app.use('/api/paginas', paginasRoutes);
app.use('/api/permissoes', permissoesRoutes);

app.get('/', (req, res) => {
  res.send('Servidor Infopoint rodando!');
});

module.exports = app;
