const { Sequelize } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    const Play = sequelize.define("Play", {
        uuid: { type: DataTypes.UUID, defaultValue: Sequelize.UUIDV4 },
        cardValue: DataTypes.TINYINT.UNSIGNED,
    }, {
        tableName: 'plays',
        timestamps: true,
        paranoid: true
    });

    Play.associate = (models) => {
        Play.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
        Play.belongsTo(models.Round, { foreignKey: "round_id", as: "round" });
        Play.belongsTo(models.Room, { foreignKey: "room_id", as: "room" });
    };
    

    return Play;
}


