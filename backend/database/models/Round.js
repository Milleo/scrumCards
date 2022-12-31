module.exports = (sequelize, DataTypes) => {
    const Round = sequelize.define("Round", {
        uuid: DataTypes.UUID,
        order: DataTypes.INTEGER.UNSIGNED,
        title: DataTypes.STRING,
    }, {
        tableName: 'rounds',
        timestamps: true,
        paranoid: true
    });
    
    Round.associate = (models) => {
        //Round.belongsTo(models.Room, { foreignKey: "room" });
    }

    return Round;
}


