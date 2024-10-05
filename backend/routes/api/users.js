const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Booking, Spot, SpotImage } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

//validate sign up info
const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Invalid email'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Username is required'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  // check('password')
  //   .exists({ checkFalsy: true })
  //   .isLength({ min: 6 }),
  check('firstName')
    .exists({checkFalsy: true})
    .withMessage('First Name is required'),
  check('lastName')
    .exists({checkFalsy:true})
    .withMessage('Last Name is required'),
  handleValidationErrors
];

//sign up a new user
router.post('/', validateSignup, async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, username } = req.body;
    const hashedPassword = bcrypt.hashSync(password);

    //user already exists
    const userEmailExists = await User.findOne({
      where: {
        email: email
      }
    })

    const usernameExists = await User.findOne({
      where: {
        username: username
      }
    })

    if(userEmailExists){
      res.status(500)
      return res.json({
        message: 'User alerady exists',
        errors: {
          email: 'User with that email already exists',
          username: 'User with that username already exists'
        }
      })
    }

    if(usernameExists){
      res.status(500)
      return res.json({
        message: 'User alerady exists',
        errors: {
          email: 'User with that email already exists',
          username: 'User with that username already exists'
        }
      })
    }

    const user = await User.create({ firstName, lastName, email, username, hashedPassword });

    const safeUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
    };

    await setTokenCookie(res, safeUser);

    res.status(201),
    res.json({
      user: safeUser
    });
  } catch (error) {
    next(error)
  }
});



module.exports = router;