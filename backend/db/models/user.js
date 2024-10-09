'use strict';
const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      //one-to-many (users to animals) - ASSOCIATION 2
      User.hasMany(models.Animal, {
        foreignKey: 'userId',
        onDelete: 'CASCADE'
      });

      //one-to-many (users to reservations) - ASSOCIATION 1
      User.hasMany(models.Reservation, {
        foreignKey: 'userId',
        onDelete: 'CASCADE'
      });

      //one-to-many (users to reviews) - ASSOCIATION 3
      User.hasMany(models.Review, {
        foreignKey: 'userId',
        onDelete: 'CASCADE'
      });
    }
  }
  User.init({
    firstName: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        isAlpha: true,
        len: [2, 30]
      }
    },
    lastName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        isAlpha: true,
        len: [2, 50]
      }
    },
    username: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
      validate: {
        len: [4, 30],
        isNotEmail(value) {
          if(Validator.isEmail(value)) {
            throw new Error ("Username cannot be an email.");
          }
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [7, 256],
        isEmail: true
      }
    },
    hashedPassword: {
      type: DataTypes.STRING.BINARY,
      allowNull: false,
      validate: {
        len: [60, 60]
      }
    }   
  }, {
    sequelize,
    modelName: 'User',
    //protect hashed password and other personal info or useless info with a default scope
    defaultScope: {
      attributes: {
        exclued: ['hashedPassword', 'email', 'createdAt', 'updatedAt']
      }
    }
  });
  return User;
};