module.exports = (sequelize, DataTypes) => {
    const UsersRooms = sequelize.define("UsersRooms", {
        id_user: { type: DataTypes.INTEGER.UNSIGNED, foreignKey: true },
        id_room: { type: DataTypes.INTEGER.UNSIGNED, foreignKey: true },
        banned: { type: DataTypes.TINYINT.UNSIGNED },
        role: { type: DataTypes.ENUM('player', 'spectator') },
        banned: DataTypes.BOOLEAN,
        role: DataTypes.ENUM('player', 'spectator')
    }, {
        tableName: 'users_rooms',
        timestamps: true,
        paranoid: true
    });
    
    return UsersRooms;
}


