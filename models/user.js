'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    emailAddress: {
      type: DataTypes.STRING,
      unique: {
        msg: 'E-mail address already in use',
      },
      validate: {
        isEmail: {
          msg: 'The e-mail is invalid, please re-enter it',
        }
      }
    },
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });

  // Creating model association
  User.associate = (models) => {
    User.hasMany(models.Course, {
      foreignKey: {
        fieldName: 'userId',
        allowNull: false,
      },
    });
  };

  return User;
};