const express = require('express');

const { requireAuth } = require('../../utils/auth');
const { Animal, Image, Review, User, Reservation } = require('../../db/models');

const { check, matchedData } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const animal = require('../../db/models/animal');
const { where } = require('sequelize');

const router = express.Router();

//get all animals
router.get('/', async(req, res, next) => {
  try {
    const animals = await Animal.findAll()

    const updatedAnimals = [];

    for (let i = 0; i < animals.length; i++){
      const animal = animals[i]
      
      const payload = {
        id: parseInt(animal.id),
        ownerId: parseInt(animal.userId),
          name: animal.name,
          birthday: animal.birthday,
          type: animal.type,
          price: parseFloat(animal.price)
      }

      updatedAnimals.push(payload)
    }

    res.json({
      Animals: updatedAnimals
    })

  } catch (error) {
    next(error)
  }
})

//get all animals owned by the current user
router.get('/current', requireAuth, async (req, res, next) => {

  try {
    //figure out current user id
    const userId = req.user.id
    const user = await User.findByPk(userId);
    
    //404 - no user
    if(!user) {
      res.status(404),
      res.json({
        message: 'No user found'
      })
    };
    
    //find all animals where the owner id is the user id
    const animals = await Animal.findAll({
      where: {
        userId: userId
      }
    });
    
    let updatedAnimals = []
    for (let i = 0; i < animals.length; i++){
      let animal = animals[i]

      const payload = {
        id: parseInt(animal.id),
        ownerId: parseInt(animal.userId),
          name: animal.name,
          birthday: animal.birthday,
          type: animal.type,
          price: parseFloat(animal.price)
      }

      updatedAnimals.push(payload)
    }

    res.json({
      Animals: updatedAnimals
    })
    
  } catch (error) {
    next(error)
  }
})

//get details of an animal based on animal id
router.get('/:animalId', async(req, res, next) => {
  try {
    //find the animal id
    const animalId = parseInt(req.params.animalId)

    //find the spot by that id
    const animal = await Animal.findByPk(animalId)

    //404 - no animal exists
    if(!animal){
      res.status(404)
      return res.json({
        message: "Animal couldn't be found"
      })
    }

    //find animal image with that id
    const animalImage = await Image.findAll({
      where: {
        animalId: animalId
      },
      attributes: ['id', 'url']
    });

    //find reviews with that id
    const reviews = await Review.findAll({
      where: {
        animalId: animalId,
      }
    });

    //find the sum of all stars
    let sumOfStars = await Review.sum("stars", {
      where: {
        animalId: animalId
      }
    });

    //find the average of all the stars from the review table
    const averageRating = (sumOfStars/reviews.length).toFixed(2)

    //find the owner of the animal
    const owner = await User.findOne({
      where: {
        id: animal.userId
      },
      attributes: ['id', 'firstName', 'lastName']
    });

    //animal exists - combine all elements
    const updatedAnimal = {
      id: parseInt(animal.id),
      ownerId: parseInt(animal.userId),
        name: animal.name,
        birthday: animal.birthday,
        type: animal.type,
        price: parseFloat(animal.price),
        numReviews: parseInt(reviews.length),
        averageStars: parseFloat(averageRating),
      Image: animalImage,
      Owner: owner
    }

    res.json(updatedAnimal)
    
  } catch (error) {
    next(error)
  }
})

module.exports = router;