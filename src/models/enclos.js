module.exports = (sequelize, DataTypes) => {
    var Enclos = sequelize.define('Enclos', {
        number: DataTypes.INTEGER,
        oldnumber: DataTypes.INTEGER,
        lieux: DataTypes.STRING,
        proprete: DataTypes.STRING,
        nbMonkey: DataTypes.INTEGER

    });

    return Enclos;
};