'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reservation extends Model {
    static associate(models) {
      //one-to-many (users to reservations) - ASSOCIATION 1
      Reservation.belongsTo(models.User, {
        foreignKey: 'userId'
      });

      //one-to-many (animals to reservations) - ASSOCIATION 4
      Reservation.belongsTo(models.Animal, {
        foreignKey: animalId
      });
    }
  }
  Reservation.init({
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
    startDate: {
      type: DataTypes.DATE,
    },
    endDate: {
      type: DataTypes.DATE
    }
}, {
    sequelize,
    modelName: 'Reservation',
  });
  return Reservation;
};