'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('rounds', {
      id: { type: Sequelize.DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true, allowNull: false },
      uuid: { type: Sequelize.DataTypes.UUID, allowNull: false, unique: true, defaultValue: Sequelize.UUIDV4 },
      order: { type: Sequelize.DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 1 },
      title: { type: Sequelize.DataTypes.STRING, allowNull: true },
      related_link: { type: Sequelize.DataTypes.STRING, allowNull: true },
      ended: { type: Sequelize.DataTypes.BOOLEAN, default: false },
      room_id: { type: Sequelize.DataTypes.INTEGER.UNSIGNED, allowNull: false, references: { model: { tableName: "rooms" }, key: 'id' } },
      createdAt: Sequelize.DataTypes.DATE,
      updatedAt: Sequelize.DataTypes.DATE,
      deletedAt: Sequelize.DataTypes.DATE
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('rounds');
  }
};