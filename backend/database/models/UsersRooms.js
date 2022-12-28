module.exports = (sequelize, DataTypes) => {
    const UsersRoom = sequelize.define("UsersRoom", {
        id_user: { type: DataTypes.UUID, defaultValue: sequelize.UUIDV4 },
        id_room: { type: DataTypes.UUID, defaultValue: sequelize.UUIDV4 },
        banned: DataTypes.BOOLEAN,
        role: DataTypes.ENUM('player', 'spectator')
    }, {
        tableName: 'users_room',
        timestamps: true,
        paranoid: true
    });
    
    return UsersRoom;
}


