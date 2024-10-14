const express = require('express');

const {requireAuth} = require('../../utils/auth');
const {Animal, Image, Review, User, Reservation} = require('../../db/models');

const {check} = require('express-validator');
const {handleValidationErrors} = require('../../utils/validation');
const { where } = require('sequelize');

const router = express.Router();

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
]

//get all reviews of current user
router.get('/current', requireAuth, async(req, res, next) => {
  try {
    //find the current user id
    const userId = req.user.id;

    //get all reviews by user id
    const reviews = await Review.findAll({
      where: {
        userId: userId
      }
    })
    
    //for each review iterate through and add the animal and image the review was written about
    let updatedReviews = [];
    for(let i = 0; i < reviews.length; i++){
      let review = reviews[i];

      //find user
      const user = await User.findOne({
        where: {
          id: userId
        },
        attributes: ['id', 'firstName', 'lastName']
      });

      //find animal
      const animal = await Animal.findOne({
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        },
        where: {
          id: review.animalId
        }
      });

      //find image
      const image = await Image.findOne({
        where: {
          animalId: animal.id
        }
      });

      //update animal with image
      let updatedAnimal = {
        id: animal.id,
        userId: animal.id,
        name: animal.name,
        birthday: animal.birthday,
        type: animal.type,
        price: animal.price,
        Image: image
      }

      const payload = {
        id: review.id,
        userId: review.userId,
        animalId: review.animalId,
        review: review.review,
        stars: review.stars,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
        User: user,
        Animal: updatedAnimal
      }

      //add updated reviews to array
      updatedReviews.push(payload);
    }

    //return requested response
    res.json({
      Reviews: updatedReviews
    })


  } catch (error) {
    next(error)
  }
})

//edit a review
router.put('/:reviewId', requireAuth, validateReview, async(req, res, next) => {
  try {
    //find review id
    const reviewId = req.params.reviewId;

    //find review by id
    const reviewToUpdate = await Review.findByPk(reviewId);

    //404 - no review found
    if(!reviewToUpdate){
      res.status(404)
      res.json({
        message: "Review couldn't be found"
      })
    }

    //review found
    //check that the user owns the review
    if(reviewToUpdate.userId !== req.user.id){
      res.status(403)
      return res.json({
        message: "Forbidden"
      })
    }

    //passes all tests - destructure from req.body
    const {review, stars} = req.body;

    let reviewResult;
    let starsResult;

    //if items exist in req.body OR not
    if(review){
      reviewResult = review
    } else {
      reviewResult = reviewToUpdate.review
    }

    if(stars){
      starsResult = stars
    } else {
      starsResult = reviewToUpdate.stars
    }

    //validation errors
    if(reviewResult === undefined){
      res.status(400)
      return res.json({
        message: "Bad Request",
        errors: {
          review: "Review text is required"
        }
      })
    }

    if(typeof(starsResult) !== "number" || starsResult < 1 || starsResult > 5){
      res.status(400)
      return res.json({
        message: "Bad Request",
        errors: {
          stars: "Stars must be an integer from 1 to 5"
        }
      })
    }

    //review update
    let updatedReview = await reviewToUpdate.update({
      userId: req.user.id,
      animalId: reviewToUpdate.AnimalId,
      review: reviewResult,
      stars: starsResult
    })

    //return requested response
    res.json(updatedReview);
    
  } catch (error) {
    next(error)
  }
})

//delete review
router.delete('/:reviewId', requireAuth, async(req, res, next) => {
  try {
    //find review id
    const reviewId = req.params.reviewId;

    //find review by id
    const review = await Review.findByPk(reviewId);

    //404 - no review found
    if(!review){
      res.status(404)
      res.json({
        message: "Review couldn't be found"
      })
    }

    //confirm that the review user is is the current user id
    if(review.userId !== req.user.id){
      res.status(403)
      return res.json({
        message: "Forbidden"
      })
    }

    //review found and owner by logged in user - destroy
    const destroyedReview = await review.destroy();

    //return requested result
    res.json({
      message: "Successfully deleted"
    });
    
  } catch (error) {
    next(error)
  }
})

module.exports = router;