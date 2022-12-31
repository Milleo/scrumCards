module.exports = (sequelize, DataTypes) => {
    const Play = sequelize.define("Play", {
        uuid: DataTypes.UUID,
        cardValue: DataTypes.TINYINT.UNSIGNED,
        user: { type: DataTypes.INTEGER.UNSIGNED, foreignKey: true },
        round: DataTypes.INTEGER.UNSIGNED
    }, {
        tableName: 'plays',
        timestamps: true,
        paranoid: true
    });

    Play.associate = (models) => {
        //Play.belongsTo(models.User);
        //Play.belongsTo(models.Round, { foreignKey: "round" });
    }
    

    return Play;
}


