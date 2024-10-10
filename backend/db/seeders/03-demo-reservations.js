'use strict';

const {Reservation} = require('../models');
const bcrypt = require('bcryptjs');
const {Op} = require('sequelize');

//define schema
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA //define your schema in optons object
};

const reservations = [
  {
    animalId: 1,
    userId: 1,
    startDate: '2025-01-01',
    endDate: '2025-01-04'
  },
  {
    animalId: 1,
    userId: 2,
    startDate: '2025-01-14',
    endDate: '2025-01-20'
  },
  {
    animalId: 1,
    userId: 3,
    startDate: '2025-02-01',
    endDate: '2025-02-04'
  },
  {
    animalId: 1,
    userId: 4,
    startDate: '2025-02-14',
    endDate: '2025-02-15'
  },
  {
    animalId: 1,
    userId: 5,
    startDate: '2025-03-01',
    endDate: '2025-03-04'
  },
  {
    animalId: 2,
    userId: 1,
    startDate: '2025-01-16',
    endDate: '2025-01-17'
  },
  {
    animalId: 2,
    userId: 2,
    startDate: '2025-01-22',
    endDate: '2025-01-23'
  },
  {
    animalId: 2,
    userId: 3,
    startDate: '2025-02-13',
    endDate: '2025-02-16'
  },
  {
    animalId: 2,
    userId: 4,
    startDate: '2025-02-21',
    endDate: '2025-02-22'
  },
  {
    animalId: 2,
    userId: 5,
    startDate: '2025-03-21',
    endDate: '2025-03-22'
  },
  {
    animalId: 2,
    userId: 1,
    startDate: '2025-01-16',
    endDate: '2025-01-17'
  },
  {
    animalId: 2,
    userId: 2,
    startDate: '2025-01-22',
    endDate: '2025-01-23'
  },
  {
    animalId: 2,
    userId: 3,
    startDate: '2025-02-13',
    endDate: '2025-02-16'
  },
  {
    animalId: 2,
    userId: 4,
    startDate: '2025-02-21',
    endDate: '2025-02-22'
  },
  {
    animalId: 2,
    userId: 5,
    startDate: '2025-03-21',
    endDate: '2025-03-22'
  },
  {
    animalId: 3,
    userId: 1,
    startDate: '2025-04-16',
    endDate: '2025-04-17'
  },
  {
    animalId: 3,
    userId: 2,
    startDate: '2025-04-22',
    endDate: '2025-04-23'
  },
  {
    animalId: 3,
    userId: 3,
    startDate: '2025-05-13',
    endDate: '2025-05-16'
  },
  {
    animalId: 3,
    userId: 4,
    startDate: '2025-05-21',
    endDate: '2025-05-22'
  },
  {
    animalId: 3,
    userId: 5,
    startDate: '2025-06-21',
    endDate: '2025-06-22'
  },
  {
    animalId: 4,
    userId: 1,
    startDate: '2025-04-01',
    endDate: '2025-04-04'
  },
  {
    animalId: 4,
    userId: 2,
    startDate: '2025-04-14',
    endDate: '2025-04-20'
  },
  {
    animalId: 4,
    userId: 3,
    startDate: '2025-05-01',
    endDate: '2025-05-04'
  },
  {
    animalId: 4,
    userId: 4,
    startDate: '2025-05-14',
    endDate: '2025-05-15'
  },
  {
    animalId: 4,
    userId: 5,
    startDate: '2025-06-01',
    endDate: '2025-06-04'
  },
  {
    animalId: 5,
    userId: 1,
    startDate: '2025-07-01',
    endDate: '2025-07-04'
  },
  {
    animalId: 5,
    userId: 2,
    startDate: '2025-07-14',
    endDate: '2025-07-20'
  },
  {
    animalId: 5,
    userId: 3,
    startDate: '2025-08-01',
    endDate: '2025-08-04'
  },
  {
    animalId: 5,
    userId: 4,
    startDate: '2025-08-14',
    endDate: '2025-08-15'
  },
  {
    animalId: 5,
    userId: 5,
    startDate: '2025-09-01',
    endDate: '2025-09-04'
  }
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Reservations';
    options.validate = true;
    await Reservation.bulkCreate(reservations, options);
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reservations';
    return queryInterface.bulkDelete(options, {
      animalId: {
        [Op.in]: [1, 2, 3, 4, 5]
      }
    }, {})
  }
};
