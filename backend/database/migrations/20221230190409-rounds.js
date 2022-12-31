'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('rounds', {
      id: { type: Sequelize.DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true, allowNull: false },
      uuid: { type: Sequelize.DataTypes.UUID, allowNull: false, unique: true, defaultValue: Sequelize.UUIDV4 },
      order: { type: Sequelize.DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 1 },
      title: { type: Sequelize.DataTypes.STRING, allowNull: true },
      room: { type: Sequelize.DataTypes.INTEGER.UNSIGNED, allowNull: false, references: { model: { tableName: "rooms" }, key: 'id' } },
      createdAt: Sequelize.DataTypes.DATE,
      updatedAt: Sequelize.DataTypes.DATE,
      deletedAt: Sequelize.DataTypes.DATE
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('rounds');
  }
};