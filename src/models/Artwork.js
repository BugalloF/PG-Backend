const { DataTypes } = require("sequelize");
const URL = 'https://artpage-api.herokuapp.com'
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define(
    "artwork",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      img: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      imgCompress: {
        type: DataTypes.TEXT,
        get() {
          const imagecompress = this.getDataValue('imgCompress')
          return `${URL}/${imagecompress}`
        }
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      likes:{
        type:DataTypes.INTEGER,
        defaultValue:0
      }
    }
  );
};