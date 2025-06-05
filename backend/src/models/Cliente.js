const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Cliente = sequelize.define('Cliente', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false
  },
  emailConfirmado: { 
    type: DataTypes.BOOLEAN, 
    allowNull: false, 
    defaultValue: false },
}, {
  tableName: 'clientes',
  timestamps: true
});

// Associação com Permissao
Cliente.associate = (models) => {
  Cliente.hasMany(models.Permissao, {
    foreignKey: 'clienteId',
    as: 'permissoes'
  });
};

module.exports = Cliente;
