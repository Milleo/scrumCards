const { Sequelize } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    const Play = sequelize.define("Play", {
        uuid: { type: DataTypes.UUID, defaultValue: Sequelize.UUIDV4 },
        cardValue: DataTypes.TINYINT.UNSIGNED,
        user: { type: DataTypes.INTEGER.UNSIGNED, foreignKey: true },
        round: { type: DataTypes.INTEGER.UNSIGNED, foreignKey: true },
    }, {
        tableName: 'plays',
        timestamps: true,
        paranoid: true
    });

    Play.associate = (models) => {
        //Play.belongsTo(models.User, { foreignKey: "user" });
        //Play.belongsTo(models.Round, { foreignKey: "round" });
    }
    

    return Play;
}


