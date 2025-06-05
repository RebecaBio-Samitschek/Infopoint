const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Permissao = sequelize.define('Permissao', {
  clienteId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'clientes',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  paginaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'paginas',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  permissao: {
    type: DataTypes.ENUM('adm', 'editor'),
    allowNull: false,
    defaultValue: 'editor'
  }
}, {
  tableName: 'permissoes',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['clienteId', 'paginaId']
    }
  ]
});

// Associations
Permissao.associate = (models) => {
  Permissao.belongsTo(models.Cliente, { foreignKey: 'clienteId', as: 'cliente' });
  Permissao.belongsTo(models.Pagina, { foreignKey: 'paginaId', as: 'pagina' });
};

module.exports = Permissao;
