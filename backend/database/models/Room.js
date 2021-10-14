module.exports = (sequelize, DataTypes) => {
    const Room = sequelize.define("Room", {
        uuid: DataTypes.UUID,
        name: DataTypes.STRING(50),
        admin: DataTypes.INTEGER.UNSIGNED
    }, {
        tableName: 'rooms',
        timestamps: true,
        paranoid: true
    });

    return Room;
}


