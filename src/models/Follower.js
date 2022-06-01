const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define(
    "follower",
    {
      idUser: { //soy follower
        type: DataTypes.STRING,
        allowNull: false,
        unique: 'follower'
      },
      idFollow: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: 'follower'
      },
    },
    { timestamps: false }
  );
};