'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('plays', {
      id: { type: Sequelize.DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true, allowNull: false },
      uuid: { type: Sequelize.DataTypes.UUID, allowNull: false, unique: true, defaultValue: Sequelize.UUIDV4 },
      cardValue: { type: Sequelize.DataTypes.TINYINT.UNSIGNED, allowNull: false, defaultValue: 1 },
      user_id: { type: Sequelize.DataTypes.INTEGER.UNSIGNED, allowNull: false, references: { model: { tableName: "users" }, key: 'id' } },
      round_id: { type: Sequelize.DataTypes.INTEGER.UNSIGNED, allowNull: false, references: { model: { tableName: "rounds" }, key: 'id' } },
      room_id: { type: Sequelize.DataTypes.INTEGER.UNSIGNED, allowNull: false, references: { model: { tableName: "rooms" }, key: 'id' } },
      createdAt: Sequelize.DataTypes.DATE,
      updatedAt: Sequelize.DataTypes.DATE,
      deletedAt: Sequelize.DataTypes.DATE
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('plays');
  }
};
