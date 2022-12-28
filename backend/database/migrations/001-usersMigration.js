module.exports = {
    up: (queryInterface, Sequelize) => {
      return queryInterface.createTable('users', {
        id: { type: Sequelize.DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true, allowNull: false },
        uuid: { type: Sequelize.DataTypes.UUID, allowNull: false, unique: true },
        name: { type: Sequelize.DataTypes.STRING(50), allowNull: false, unique: true },
        email: { type: Sequelize.DataTypes.STRING(75), allowNull: true, unique: true },
        password: { type: Sequelize.DataTypes.STRING(100), allowNull: true },
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
