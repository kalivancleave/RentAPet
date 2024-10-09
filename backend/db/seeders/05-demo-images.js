'use strict';

const {Image} = require('../models');
const bcrypt = require('bcryptjs');
const {Op} = require('sequelize');

//define schema
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA //define your schema in optons object
}

const images = [
  {
    animalId: 1,
    url: 'url.png'
  },
  {
    animalId: 2,
    url: 'url.png'
  },
  {
    animalId: 3,
    url: 'url.png'
  },
  {
    animalId: 4,
    url: 'url.png'
  },
  {
    animalId: 5,
    url: 'url.png'
  }
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Images';
    options.validate = true;
    await Image.bulkCreate(images, options);
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Images';
    return queryInterface.bulkDelete(options, {
      id: {
        [Op.in]: [1, 2, 3, 4, 5]
      }
    }, {})
  }
};
