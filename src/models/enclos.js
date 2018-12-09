module.exports = (sequelize, DataTypes) => {
    var Enclos = sequelize.define('Enclos', {
        lieux: DataTypes.STRING,
        proprete: DataTypes.STRING,
        nbMonkey: DataTypes.INTEGER

    });

    return Enclos;
};