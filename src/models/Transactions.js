const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define(
    "transactions",
    {
      userSeller: { 
        type: DataTypes.STRING,
        allowNull: false,
      },
      userPayer: { 
        type: DataTypes.STRING,
        allowNull: false,

      },
      title: { 
        type: DataTypes.STRING,
        allowNull: false,

      },
      email: { 
        type: DataTypes.STRING,
        allowNull: false,

      },
      price: { 
        type: DataTypes.INTEGER,
        allowNull: false,

      },
      
      isPayed : {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    },
  );
};