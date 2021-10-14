module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        uuid: DataTypes.UUID,
        name: DataTypes.STRING(50),
        admin: DataTypes.INTEGER.UNSIGNED,
        role: DataTypes.ENUM('player', 'spectator'),
    }, {
        tableName: 'users',
        timestamps: true,
        paranoid: true
    });

    return User;
}


