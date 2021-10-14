module.exports = {
    up: (queryInterface, Sequelize) => {
      return queryInterface.createTable('users', {
        id: { type: Sequelize.DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true, allowNull: false },
        uuid: { type: Sequelize.DataTypes.UUID, allowNull: false },
        name: { type: Sequelize.DataTypes.STRING(50), allowNull: false },
        role: { type: Sequelize.DataTypes.ENUM('player', 'spectator'), allowNull: false },
        createdAt: Sequelize.DataTypes.DATE,
        updatedAt: Sequelize.DataTypes.DATE,
        deletedAt: Sequelize.DataTypes.DATE
      });
    },
    down: (queryInterface, Sequelize) => {
      return queryInterface.dropTable('users');
    }
  };