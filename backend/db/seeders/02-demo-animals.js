'use strict';

const {Animal} = require('../models');
const bcrypt = require('bcryptjs');
const {Op} = require('sequelize');

//define schema
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA //define your schema in optons object
}

const animals = [
  {
    userId: 1,
    name: 'Henry',
    birthday: '2017-09-01',
    type: 'dog',
    price: 10.00
  },
  {
    userId: 1,
    name: 'Greg',
    birthday: '2000-05-21',
    type: 'cat',
    price: 8.00
  },
  {
    userId: 3,
    name: 'Zed',
    birthday: '2002-01-14',
    type: 'exotic',
    price: 100.00
  },
  {
    userId: 4,
    name: 'Merlin',
    birthday: '2014-10-31',
    type: 'horse',
    price: 45.00
  },
  {
    userId: 5,
    name: 'Alfrid',
    birthday: '2012-02-14',
    type: 'dog',
    price: 10.00
  }
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Animals';
    options.validate = true;
    await Animal.bulkCreate(animals, options)
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Animals';
    return queryInterface.bulkDelete(options, {
      id: {
        [Op.in]: [1, 2, 3, 4, 5]
      }
    }, {})
  }
};
