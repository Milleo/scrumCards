module.exports = (sequelize, DataTypes) => {
    const Room = sequelize.define("Room", {
        uuid: { type: DataTypes.UUID, defaultValue: sequelize.UUIDV4 },
        name: DataTypes.STRING(50),
        owner: { type: DataTypes.INTEGER.UNSIGNED, foreignKey: true },
        maxValue:  DataTypes.TINYINT.UNSIGNED,
        includeUnknownCard: DataTypes.BOOLEAN,
        includeCoffeeCard: DataTypes.BOOLEAN,
        uri: DataTypes.STRING(8)
    }, {
        tableName: 'rooms',
        timestamps: true,
        paranoid: true
    });

    Room.associate = (models) => {
        console.log(models.UsersRooms);
        Room.belongsToMany(models.User, { through: models.UsersRooms, as: "users", foreignKey: "id_room" });
    }
    

    return Room;
}


