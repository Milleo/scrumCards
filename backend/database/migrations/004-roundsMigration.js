module.exports = {
    up: (queryInterface, Sequelize) => {
      return queryInterface.createTable('rounds', {
        id: { type: Sequelize.DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true, allowNull: false },
        uuid: { type: Sequelize.DataTypes.UUID, allowNull: false, defaultValue: Sequelize.UUIDV4 },
        order: { type: Sequelize.DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 1 },
        createdAt: Sequelize.DataTypes.DATE,
        updatedAt: Sequelize.DataTypes.DATE,
        deletedAt: Sequelize.DataTypes.DATE
      });
    },
    down: (queryInterface, Sequelize) => {
      return queryInterface.dropTable('rounds');
    }
  };