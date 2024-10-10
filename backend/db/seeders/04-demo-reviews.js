'use strict';

const {Review} = require('../models');
const bcrypt = require('bcryptjs');
const {Op} = require('sequelize');

//define schema
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA //define your schema in optons object
};

const reviews = [
  {
    animalId: 1,
    userId: 2,
    review: "Review left about animal number 1.",
    stars: 5
  },
  {
    animalId: 1,
    userId: 3,
    review: "Another review left about animal number 1.",
    stars: 5
  },
  {
    animalId: 1,
    userId: 4,
    review: "User 4 left a review about animal number 1.",
    stars: 4
  },
  {
    animalId: 1,
    userId: 5,
    review: "User 5 left a review about animal number 1.",
    stars: 5
  },
  {
    animalId: 2,
    userId: 2,
    review: "Review left about animal number 2.",
    stars: 3
  },
  {
    animalId: 2,
    userId: 3,
    review: "Another review left about animal number 2.",
    stars: 5
  },
  {
    animalId: 2,
    userId: 4,
    review: "User 4 left a review about animal number 2.",
    stars: 4
  },
  {
    animalId: 2,
    userId: 5,
    review: "User 5 left a review about animal number 2.",
    stars: 4
  },
  {
    animalId: 3,
    userId: 1,
    review: "Review left about animal number 3.",
    stars: 5
  },
  {
    animalId: 3,
    userId: 2,
    review: "Another review left about animal number 3.",
    stars: 5
  },
  {
    animalId: 3,
    userId: 4,
    review: "User 4 left a review about animal number 3.",
    stars: 5
  },
  {
    animalId: 3,
    userId: 5,
    review: "User 5 left a review about animal number 3.",
    stars: 5
  },
  {
    animalId: 4,
    userId: 1,
    review: "Review left about animal number 4.",
    stars: 1
  },
  {
    animalId: 4,
    userId: 2,
    review: "Another review left about animal number 4.",
    stars: 5
  },
  {
    animalId: 4,
    userId: 3,
    review: "User 3 left a review about animal number 4.",
    stars: 4
  },
  {
    animalId: 4,
    userId: 5,
    review: "User 5 left a review about animal number 4.",
    stars: 5
  },
  {
    animalId: 5,
    userId: 1,
    review: "Review left about animal number 5.",
    stars: 3
  },
  {
    animalId: 1,
    userId: 2,
    review: "Another review left about animal number 5.",
    stars: 5
  },
  {
    animalId: 1,
    userId: 3,
    review: "User 3 left a review about animal number 5.",
    stars: 2
  },
  {
    animalId: 1,
    userId: 4,
    review: "User 4 left a review about animal number 5.",
    stars: 1
  },
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    options.validate = true;
    await Review.bulkCreate(reviews, options);
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    return queryInterface.bulkDelete(options, {
      id: {
        [Op.in]: [1, 2, 3, 4, 5]
      }
    }, {})
  }
};
