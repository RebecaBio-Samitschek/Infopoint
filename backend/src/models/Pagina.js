const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Pagina = sequelize.define('Pagina', {
  clienteId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  layout: {
    type: DataTypes.STRING,
    allowNull: false
  },
  dados: {
    type: DataTypes.JSON,
    allowNull: false
  }
}, {
  tableName: 'paginas',
  timestamps: true
});

Pagina.associate = (models) => {
  Pagina.hasMany(models.Permissao, { foreignKey: 'paginaId', as: 'permissoes' });
};

module.exports = Pagina;
