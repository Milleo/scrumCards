module.exports = (sequelize, DataTypes) => {
    const Room = sequelize.define("Room", {
        uuid: { type: DataTypes.UUID, defaultValue: sequelize.UUIDV4 },
        name: DataTypes.STRING(50),
        owner: DataTypes.INTEGER.UNSIGNED,
        includeUnknownCard: DataTypes.BOOLEAN,
        includeCoffeeCard: DataTypes.BOOLEAN,
        uri: DataTypes.STRING(8)
    }, {
        tableName: 'rooms',
        timestamps: true,
        paranoid: true
    });

    Room.associeate = (models) => {
        Room.belongsToMany(models.User, { through: "users_rooms", as: "users", foreignKey: "id_room" });
    }
    

    return Room;
}


