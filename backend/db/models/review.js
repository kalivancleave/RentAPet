'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {
      //one-to-many (user to reviews) - ASSOCIATION 3
      Review.belongsTo(models.User, {
        foreignKey: 'userId'
      });

      //one-to-many (animal to reviews) - ASSOCIATION 6
      Review.belongsTo(models.Animal, {
        foreignKey: 'animalId'
      });
    }
  }
  Review.init({
    animalId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isNumeric: true
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isNumeric: true
      }
    },
    review: {
      type: DataTypes.STRING(350),
      validate: {
        len: [10, 350]
      }
    },
    stars: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 5,
      validate: {
        isNumeric: true,
        min: 0,
        max: 5
      }
    },    
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};