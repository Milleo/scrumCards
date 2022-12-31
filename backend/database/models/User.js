module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        uuid: { type: DataTypes.UUID, defaultValue: sequelize.UUIDV4 },
        name: DataTypes.STRING(50),
        email: DataTypes.STRING(75),
        password: DataTypes.STRING(100)
    }, {
        tableName: 'users',
        timestamps: true,
        paranoid: true
    });

    User.associate = (models) => {
        User.belongsToMany(models.Room, { through: models.UsersRooms, as: "rooms", foreignKey: "id_user" });
    }

    return User;
}


