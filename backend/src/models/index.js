const sequelize = require('../config/db');
const Cliente = require('./Cliente');
const Pagina = require('./Pagina');
const Permissao = require('./Permissao');

// Associações
Cliente.hasMany(Pagina, { foreignKey: 'clienteId' });
Pagina.belongsTo(Cliente, { foreignKey: 'clienteId' });

Cliente.hasMany(Permissao, { foreignKey: 'clienteId' });
Permissao.belongsTo(Cliente, { foreignKey: 'clienteId', as: 'cliente' });

Pagina.hasMany(Permissao, { foreignKey: 'paginaId' });
Permissao.belongsTo(Pagina, { foreignKey: 'paginaId', as: 'pagina' });

module.exports = {
  sequelize,
  Cliente,
  Pagina,
  Permissao
};
