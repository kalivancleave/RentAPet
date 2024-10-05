'use strict';

const { User } = require('../models');
const bcrypt = require('bcryptjs');

//define schema
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; 
}

const users = [
  {
    firstName: "Demo",
    lastName: "User",
    username: "demouser",
    email: "demo@email.io",
    hashedPassword: bcrypt.hashSync('Password')
  },
  {
    firstName: "Person",
    lastName: "Lastname",
    username: "personlastname",
    email: "person@email.io",
    hashedPassword: bcrypt.hashSync('Password')
  },
  {
    firstName: "Alternate",
    lastName: "Login",
    username: "alternatelogin",
    email: "alternate@email.io",
    hashedPassword: bcrypt.hashSync('Password')
  }
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Users', //options definition for using schema
    options.validate = true,
    await User.bulkCreate(users, options)
  },

  async down (queryInterface, Sequelize) {
    options.tableName = "Users"; //options defintion for using schema
    return queryInterface.bulkDelete(options, {
      username: {
        [Op.in]: ['demouser', 'personlastname', 'alternatelogin']
      }
    }, {});
  }
};
