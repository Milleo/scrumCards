'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users_rooms', {
      id: { type: Sequelize.DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true, allowNull: false },
      id_user: { type: Sequelize.DataTypes.INTEGER.UNSIGNED, allowNull: false, references: { model: { tableName: "users" }, key: 'id' } },
      id_room: { type: Sequelize.DataTypes.INTEGER.UNSIGNED, allowNull: false, references: { model: { tableName: "rooms" }, key: 'id' } },
      banned: { type: Sequelize.DataTypes.TINYINT.UNSIGNED, allowNull: false, defaultValue: 0 },
      role: { type: Sequelize.DataTypes.ENUM('player', 'spectator', 'owner'), allowNull: false, defaultValue: 'player' },
      createdAt: Sequelize.DataTypes.DATE,
      updatedAt: Sequelize.DataTypes.DATE,
      deletedAt: Sequelize.DataTypes.DATE
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users_rooms');
  }
};