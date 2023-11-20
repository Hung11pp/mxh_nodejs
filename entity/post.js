const { DataTypes, Model } = require('sequelize');
const User = require('./user');
const sequelize = require('../db');
class Post extends Model {
}
Post.init(
  {
    id:{
      type:DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    content:{
      type:DataTypes.STRING,
      allowNull:false,
    }
  },
  {
    sequelize,
    modelName:'Post'
  }
)
module.exports= Post;