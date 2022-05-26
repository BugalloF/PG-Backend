const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define(
    "profile",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      }, // obligatory fields |||||
      is_Admin: {
        type: DataTypes.BOOLEAN,
      },
      day_of_birth: {
        type: DataTypes.STRING,
      },
      gender: {
        type: DataTypes.STRING,
      },
      img: {
        type: DataTypes.TEXT,
      },
      phone: {
        type: DataTypes.INTEGER,
        
      },
      public_email: {
        type: DataTypes.STRING,
        
      },
      description: {
        type: DataTypes.STRING
      },
      country:{
          type:DataTypes.STRING,
          
      }
    },
    { timestamps: false }
  );
};