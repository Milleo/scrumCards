module.exports = {
    up: (queryInterface, Sequelize) => {
      return queryInterface.createTable('rooms', {
        id: { type: Sequelize.DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true, allowNull: false },
        uuid: { type: Sequelize.DataTypes.UUID, allowNull: false, defaultValue: Sequelize.UUIDV4 },
        name: { type: Sequelize.DataTypes.STRING(50), allowNull: false },
        includeUnknownCard: { type: Sequelize.DataTypes.BOOLEAN, alloNull: false, defaultValue: 0 },
        includeCoffeeCard: { type: Sequelize.DataTypes.BOOLEAN, alloNull: false, defaultValue: 0 },
        maxValue: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, defaultValue: 100 },
        owner: { type: Sequelize.DataTypes.INTEGER.UNSIGNED, allowNull: false, references: { model: { tableName: "users" }, key: 'id' } },
        uri: { type: Sequelize.DataTypes.STRING(8), allowNull: false, unique: true },
        createdAt: Sequelize.DataTypes.DATE,
        updatedAt: Sequelize.DataTypes.DATE,
        deletedAt: Sequelize.DataTypes.DATE
      });
    },
    down: (queryInterface, Sequelize) => {
      return queryInterface.dropTable('rooms');
    }
  };