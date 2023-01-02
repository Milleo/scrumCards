const { Sequelize } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    const Round = sequelize.define("Round", {
        uuid: { type: DataTypes.UUID, defaultValue: Sequelize.UUIDV4 },
        order: DataTypes.INTEGER.UNSIGNED,
        title: DataTypes.STRING(100),
        related_link: DataTypes.STRING(255),
        ended: { type: DataTypes.BOOLEAN, defaultValue: false }
    }, {
        tableName: 'rounds',
        timestamps: true,
        paranoid: true
    });
    
    Round.associate = (models) => {
        Round.belongsTo(models.Room, { foreignKey: "room_id" });
    }

    return Round;
}


