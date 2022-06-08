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
        defaultValue: "https://i.pinimg.com/564x/20/0d/72/200d72a18492cf3d7adac8a914ef3520.jpg",
      },
      phone: {
        type: DataTypes.STRING,
        
      },
      description: {
        type: DataTypes.STRING
      },
      country:{
          type:DataTypes.STRING,
      },
      linkedIn:{
        type:DataTypes.STRING
      },
      facebook:{
        type:DataTypes.STRING
      },
      instagram:{
        type:DataTypes.STRING
      }
    },
    { timestamps: false }
  );
};