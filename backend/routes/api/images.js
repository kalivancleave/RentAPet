const express = require('express');

const { requireAuth } = require('../../utils/auth');
const { Animal, Image, Review, User, Reservaion } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

//delete an image
router.delete('/:imageId', requireAuth, async(req, res, next) => {
  try {
    //find image id
    const imageId = req.params.imageId;

    //find animal image by id
    const image = await Image.findByPk(imageId);

    //404 - no image found
    if(!image){
      res.status(404)
      res.json({
        message: "Image couldn't be found"
      })
    }

    //image found
    //Authorization: make sure the logged in user owns the animal
    const animal = await Spot.findOne({
      where: {
        id: image.animalId
      }
    })

    if(animal.userId !== req.user.id){
      res.status(403)
      return res.json({
        message: "Forbidden"
      })
    }

    //passes restrictions destroy image
    const imageToDestroy = image.destroy();

    //return requested response
    res.json({
      message: "Successfully deleted"
    })
    
  } catch (error) {
    next(error)
  }
})

module.exports = router;