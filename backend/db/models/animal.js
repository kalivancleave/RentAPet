'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Animal extends Model {
    static associate(models) {
      //one-to-many (users to animals) - ASSOCIATION 2
      Animal.belongsTo(models.User, {
        foreignKey: 'userId'
      });

      //one-to-many (animals to reservations) - ASSOCIATION 4
      Animal.hasMany(models.Reservation, {
        foreignKey: 'animalId',
        onDelete: 'CASCADE'
      });

      //one-to-many (animal to images) - ASSOCIATION 5
      Animal.hasMany(models.Image, {
        foreignKey: 'animalId',
        onDelete: 'CASCADE'
      });

      //one-to-many (animal to reviews) - ASSOCIATION 6
      Animal.hasMany(models.Review, {
        foreignKey: 'animalId',
        onDelete: 'CASCADE'
      });
    }
  }
  Animal.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isNumeric: true
      }
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        isAlpha: true,
        len: [2, 50]
      }
    },
    birthday: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true
      }
    },
    type: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        isAlpha: true,
        len: [2, 30]
      }
    },
    price: {
      type: DataTypes.DECIMAL,
      defaultValue: 0.00,
      allowNull: false,
      validate: {
        min: 0,
        isDecimal: true
      }
    }
}, {
    sequelize,
    modelName: 'Animal',
  });
  return Animal;
};