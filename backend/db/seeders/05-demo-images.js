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
    url: 'https://res.cloudinary.com/djnfjzocb/image/upload/v1729033065/dog_ycgcxq.png'
  },
  {
    animalId: 2,
    url: 'https://res.cloudinary.com/djnfjzocb/image/upload/v1729033065/cat_bcnwib.png'
  },
  {
    animalId: 3,
    url: 'https://res.cloudinary.com/djnfjzocb/image/upload/v1729033065/snake_orsjjb.png'
  },
  {
    animalId: 4,
    url: 'https://res.cloudinary.com/djnfjzocb/image/upload/v1729033065/horse_lw7mtc.png'
  },
  {
    animalId: 5,
    url: 'https://res.cloudinary.com/djnfjzocb/image/upload/v1729033065/dog_1_tpswoq.png'
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
