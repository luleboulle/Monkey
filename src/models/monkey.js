module.exports = (sequelize, DataTypes) => {
    var Monkey = sequelize.define('Monkey', {
        name: DataTypes.STRING,
        oldname: DataTypes.STRING,
        race: DataTypes.STRING,
        genre: DataTypes.STRING,
        age: DataTypes.INTEGER,
        weight: DataTypes.FLOAT

    });

    return Monkey;
};