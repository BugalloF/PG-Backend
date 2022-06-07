const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define(
    "likes",
    {
      idPost: { //soy el post a likear
        type: DataTypes.STRING,
        allowNull: false,
        unique: 'likeado'
      },
      idUser: { // soy el likea
        type: DataTypes.STRING,
        allowNull: false,
        unique: 'likeado'
      },
    },
    { timestamps: false }
  );
};