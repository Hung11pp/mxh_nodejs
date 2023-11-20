const { Sequelize, DataTypes,Model } = require('sequelize');
const sequelize = require('../db');
const Post = require('./post');

class User extends Model {
    toJSON() {
        const values = Object.assign({}, this.get());
        delete values.password;
        return values;
      }
}
User.init(
    {
        id:{
            type:DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          username:{
            type:DataTypes.STRING,
            allowNull:false,
            unique:true,
          },
          password:{
            type:DataTypes.STRING,
            allowNull:false,
          },
          email:{
            type:DataTypes.STRING,
            allowNull:false,
          }
    },
    {
        sequelize,
        modelName:'User'
    }
)

module.exports= User;