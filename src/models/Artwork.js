const { DataTypes } = require("sequelize");
const URL = `localhost:3001`
module.exports = (sequelize) => {
  
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