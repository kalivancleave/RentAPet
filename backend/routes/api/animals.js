const express = require('express');

const { requireAuth } = require('../../utils/auth');
const { Animal, Image, Review, User, Reservation } = require('../../db/models');

const { check, matchedData } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const animal = require('../../db/models/animal');
const { where } = require('sequelize');

const router = express.Router();

//validate spot info
const validateAnimal = [
  check('name')
    .exists({checkFalsy: true})
    .isString()
    .isLength({
      min: 1,
      max: 49
    })
    .withMessage('Name is required'),
  check('birthday')
    .exists({checkFalsy: true})
    .withMessage('birthday is required'),
  check('type')
    .exists({checkFalsy: true})
    .withMessage('type is required'),
  check('price')
    .exists({checkFalsy: true})
    .withMessage('Price is required'),
  check('price')
    .isFloat({min: 0})
    .withMessage('Price must be a positive number'),
  handleValidationErrors
];

//validate review info
const validateReview = [
  check('review')
    .exists({checkFalsy: true})
    .withMessage('Review text is required'),
  check('stars')
    .isFloat({
      min: 1,
      max: 5
    })
    .withMessage('Stars must be an integer from 1 to 5'),
  handleValidationErrors
];

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

//get all reviews for an animal
router.get('/:animalId/reviews', async (req, res, next) => {
  try {
    //find animal id
    const animalId = req.params.animalId

    //find animal by id
    const animal = await Animal.findByPk(animalId)

    //404 - no animal found
    if(!animal){
      res.status(404)
      return res.json({
        message: "Animal couldn't be found"
      })
    };

    //find reviews by id
    const reviews = await Review.findAll({
      where: {
        animalId: animal.id
      }
    });

    //iterate through reviews
    let updatedReviews = []
    for(let i = 0; i < reviews.length; i++){
      let review = reviews[i]

      //find user
      const user = await User.findOne({
        where: {
          id: review.userId
        },
        attributes: ['id', 'firstName', 'lastName']
      });

      const payload = {
        id: review.id,
        userId: review.userId,
        animalId: review.animalId,
        review: review.review,
        stars: review.stars,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
        User: user
      }
      updatedReviews.push(payload)
    }

    //return requested response
    res.json({
      Reviews: updatedReviews
    })
    
  } catch (error) {
    next(error)
  }
});

//get reservations for an animal based on the animal id
router.get('/:animalId/reservations', requireAuth, async(req, res, next) => {
  try {
    //find animal id
    const animalId = req.params.animalId;

    //find animal by id
    const animal = await Animal.findByPk(animalId);

    //404 - no animal found
    if(!animal) {
      res.status(404)
      return res.json({
        message: "Animal couldn't be found"
      })
    };

    //animal found
    //find all reservations based on animal id
    const reservations = await Reservation.findAll({
      where: {
        animalId: animalId
      }
    });

    //sort between reservations if the user id is the animal owner
    //or if they are not the owner (animal owner will see more info than non-owner)
    let ownerReservations = [];
    let nonOwnerReservations = [];
    if(animal.userId === req.user.id) {
      for (let i = 0; i < reservations.length; i++){
        let reservation = reservations[i];

        const user = await User.findOne({
          where: {
            id: reservation.userId
          },
          attributes: ['id', 'firstName', 'lastName']
        });

        const ownerReservationInfo = {
          User: user,
          id: reservation.id,
          animalId: reservation.animalId,
          userId: reservation.userId,
          startDate: reservation.startDate.toISOString().split('T')[0],
          endDate: reservation.endDate.toISOString().split('T')[0],
          createdAt: reservation.createdAt,
          updatedAt: reservation.updatedAt
        }

        ownerReservations.push(ownerReservationInfo);
      }
    } else {
      for (let i = 0; i < reservations.length; i++) {
        let reservation = reservations[i];

        const nonOwnerReservationInfo = {
          animalId: reservation.animalId,
          startDate: reservation.startDate.toISOString().split('T')[0],
          endDate: reservation.endDate.toISOString().split('T')[0]
        }

        nonOwnerReservations.push(nonOwnerReservationInfo);
      }
    };

    //if user.id is animal owner id
    if(animal.userId === req.user.id){
      return res.json({
        Reservations: ownerReservations
      });
    }

    //response for non owner
    res.json({
      Reservations: nonOwnerReservations
    })
    
  } catch (error) {
    next(error)
  }
});

//create an animal
router.post('/', requireAuth, validateAnimal, async(req, res, next) => {
  try {
    //find the id of the logged in user
    const userId = req.user.id;

    //descructure from body
    const {name, birthday, type, price} = req.body

    //create a new animal
    const newAnimal = await Animal.create({
      userId: userId,
      name,
      birthday,
      type,
      price
    });

    //return requested response
    res.status(201),
    res.json({
      is: parseInt(newAnimal.id),
      userId: parseInt(newAnimal.userId),
      name: newAnimal.name,
      birthday: newAnimal.birthday,
      type: newAnimal.type,
      price: parseFloat(newAnimal.price)
    })

  } catch (error) {
    next(error)
  }
});

//add an image to an animal based on the animal id
router.post('/:animalId/images', requireAuth, async (req, res, next) => {
  try {
    //find current logged in user Id
    const userId = req.user.id;

    //find animal id
    const animalId = req.params.animalId;

    //find animal by id
    const animal = await Animal.findByPk(animalId);

    //404 - no animal
    if(!animal){
      res.status(404)
      return res.json({
        message: "Animal couldn't be found"
      })
    }

    //make sure user owns the animal before posting a photo
    if(animal.userId !== userId){
      res.status(403)
      return res.jsno({
        message: "Forbidden"
      })
    }

    //spot found
    //destructure req.body
    const {url} = req.body;

    //create new image
    const newImage = await Image.create({
      animalId: animalId,
      url
    })

    //return requested response
    res.status(201),
    res.json({
      id: parseInt(newImage.id),
      url: newImage.url
    })
    
  } catch (error) {
    next(error)
  }
})

//create a review for an animal based on animal id
router.post('/:animalId/reviews', requireAuth, validateReview, async(req, res, next) => {
  try {
    //find animal id
    const animalId = req.params.animalId;

    //find animal by id
    const animal = await Animal.findByPk(animalId);

    //404 - no spot found
    if(!animal){
      res.status(404)
      return res.json({
        message: "Animal couldn't be found"
      })
    }

    //search reviews: if the user already has a review for this animal
    const userReviewCheck = await Review.findOne({
      where: {
        userId: req.user.id,
        spotId: spotId
      }
    });

    if(userReviewCheck){
      res.status(500)
      return res.json({
        message: "User already has a review for this animal"
      })
    }

    //animal found
    //descture from req.body
    const {review, stars} = req.body;

    //create a new review
    const newReview = await Review.create({
      userId: parseInt(req.user.id),
      spotId: parseInt(spotId),
      review,
      stars
    });

    //return requested response
    res.status(201)
    res.json(newReview)
    
  } catch (error) {
    next(error)
  }
})

router.post('/:animalId/bookings', requireAuth, async (req, res, next) => {
  try {
    //find animal id
    const animalId = req.params.animalId;

    //find animal by id
    const animal = await Animal.findByPk(animalId);

    //404 - no animal found
    if(!animal){
      res.status(404)
      return res.json({
        message: "Animal couldn't be found"
      })
    };

    //animal found
    //find all bookings for that animal id before adding another
    const reservations = await Reservation.findAll({
      where: {
        spotId: spotId
      }
    });

    //animal must NOT belong to current user
    if(spot.userId === req.user.id){
      res.status(403)
      return res.json({
        message: 'Forbidden'
      })
    }

    //descture from req.body
    const {startDate, endDate} = req.body;

    //check and make sure there are no date conflicts
    let minAllowedDate = new Date()
    let newBookingStartDate = new Date(startDate).getTime();
    let newBookingEndDate = new Date(endDate).getTime();

    //400 - bad requests
    if(newBookingEndDate <= newBookingStartDate){
      res.status(400)
      return res.json({
        message: "Bad Request",
        errors: {
          endDate: "End date cannot be on or before start date."
        }
      })
    } else if (newBookingStartDate < minAllowedDate){
      res.status(400)
      return res.json({
        message: "Bad Request",
        errors: {
          startDate: "Start date cannot be a date in the past."
        }
      })
    }

    //403 - reservation conflict
    //iterate through all of the reservations
    for (let i = 0; i < reservations.length; i++){
      let reservation = reservations[i];

      //check requested dates v. all other reserved dates
      let date1 = new Date(reservation.startDate).getTime();
      let date2 = new Date(reservation.endDate).getTime();

      //errors if dates overlap
      if(newBookingEndDate >= date1 && newBookingEndDate <= date2){
        res.status(403)
        return res.json({
          message: "Sorry, this animal is already reserved for these specific dates",
          errors: {
            startDate: "Start date conflicts with an existing reservation.",
            endDate: "End date conflices with an existing reservation."
          }
        })
      } else if (newBookingStartDate >= date1 && newBookingStartDate <= date2){
        res.status(403)
        return res.json({
          message: "Sorry, this animal is already reserved for these specific dates",
          errors: {
            startDate: "Start date conflicts with an existing reservation.",
            endDate: "End date conflices with an existing reservation."
          }
        })
      } else if (newBookingStartDate <= date1 && newBookingEndDate >= date2){
        res.status(403)
        return res.json({
          message: "Sorry, this animal is already reserved for these specific dates",
          errors: {
            startDate: "Start date conflicts with an existing reservation.",
            endDate: "End date conflices with an existing reservation."
          }
        })
      };
    };

    //request passes all checks
    //create a reservation request
    let newReservation = await Reservation.create({
      animalId: animalId,
      userId: req.user.id,
      startDate,
      endDate
    })

    //return requested response
    res.status(201)
    res.json({
      id: parseInt(newReservation.id),
      animalId: parseInt(newReservation.animalId),
      userId: parseInt(newReservation.userId),
      startDate: newReservation.startDate.toISOString().split('T')[0],
      endDate: newReservation.endDate.toISOString().split('T')[0],
      createdAt: newReservation.createdAt,
      updatedAt: newReservation.updatedAt
    })
    
  } catch (error) {
    next(error)
  }
})

//edit an animal
router.put('/:animalId', requireAuth, validateAnimal, async (req, res, next) => {
  try {
    //find the animal id
    const animalId = req.params.animalId;

    //find user id
    const userId = req.user.id;

    //find animal by id
    const animal = await Animal.findByPk(animalId);

    //404 - no animal found
    if(!animal){
      res.status(404)
      return res.json({
        message: "Animal couldn't be found"
      })
    }

    //check that logged in user owns the animal
    if(animal.userId !== req.user.id){
      res.status(403)
      return res.json({
        message: "Forbidden"
      })
    }

    //animal found and owned by logged in user
    //destructure from req.body
    const {name, birthday, type, price} = req.body;

    let nameUpdate;
    let birthdayUpdate;
    let typeUpdate;
    let priceUpdate;

    //items found or not found in req.body
    if(name){
      nameUpdate = address
    } else {
      nameUpdate = animal.name
    }

    if(birthday){
      birthdayUpdate = birthday
    } else {
      birthdayUpdate = animal.birthday
    }

    if(type){
      typeUpdate = type
    } else {
      typeUpdate = animal.type
    }

    if(price){
      priceUpdate = price
    } else {
      priceUpdate = animal.price
    }

    //validation errors
    if(nameUpdate === undefined && nameUpdate.split("").length >= 50){
      res.status(400)
      return res.json({
        message: "Bad Request",
        errors: {
          address: "Name is required and must be less than 50 characters."
        }
      })
    };

    if(birthdayUpdate === undefined){
      res.status(400)
      return res.json({
        message: "Bad Request",
        errors: {
          address: "Birthday is required"
        }
      })
    };
    
    if(typeUpdate === undefined){
      res.status(400)
      return res.json({
        message: "Bad Request",
        errors: {
          address: "Type is required"
        }
      })
    };
    
    if(priceUpdate !== undefined && price < 0){
      res.status(400)
      return res.json({
        message: "Bad Request",
        errors: {
          address: "Price is required and must be a positive number"
        }
      })
    };

    //animal update
    const updatedAnimal = await animal.update({
      userId: parseInt(userId),
      name: nameUpdate,
      birthday: birthdayUpdate,
      type: typeUpdate,
      price: priceUpdate
    })

    //return requested response
    res.json(updatedAnimal)
    
  } catch (error) {
    next(error)
  }
})

//delete an animal
router.delete('/:animalId', requireAuth, async (req, res, next) => {
  try {
    //find animal id
    const animalId = req.params.animalId

    //find animal by id
    const animalToDestroy = await Animal.findByPk(animalId);

    //find logged in user id
    const userId = req.user.id;

    //404 - no animal found
    if(!animalToDestroy){
      res.status(404)
      return res.json({
        message: "Animal couldn't be found"
      })
    }

    //make sure logged in user is the owner of the animal
    if(animalToDestroy.userId !== userId){
      res.status(403)
      return res.json({
        message: "Forbidden"
      })
    }

    //animal found and user is owner
    //destroy animal
    await animalToDestroy.destroy();

    //return requested response
    res.json({
      message: "Successfully deleted"
    })

  } catch (error) {
    next(error)
  }
})


module.exports = router;