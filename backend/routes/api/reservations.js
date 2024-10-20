const express = require('express');

const { requireAuth } = require('../../utils/auth');
const { Animal, Image, Review, User, Reservation } = require('../../db/models');

const {check} = require('express-validator');
const {handleValidationErrors} = require('../../utils/validation');

const router = express.Router();

//get all user reservations
router.get('/current', requireAuth, async(req, res, next) => {
  try {
    //find user id
    const userId = req.user.id;

    //find reservations where the userId is the logged in user Id
    const reservations = await Reservation.findAll({
      where: {
        userId: userId
      },
      attributes: ['id', 'animalId', 'startDate', 'endDate', 'createdAt', 'updatedAt']
    })

    //bookings found and belong to user
    //iterate through the bookings
    let updateReservations = [];
    for (let i = 0; i < reservations.length; i++) {
      let reservation = reservations[i];

      //add animal info
      const animal = await Animal.findOne({
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        },
        where: {
          id: reservation.animalId
        }
      })

      //find image url
      const animalImage = await Image.findOne({
        where: {
          animalId: reservation.animalId
        }
      });

      const animalPayload = {
        id: animal.id,
        userId: animal.userId,
        name: animal.name,
        birthday: animal.birthday,
        type: animal.type,
        price: parseFloat(animal.price),
        Image: animalImage
      }

      const fullReservationInfo = {
        id: reservation.id,
        animalId: reservation.animalId,
        Animal: animalPayload,
        userId: req.user.id,
        startDate: reservation.startDate.toISOString().split('T')[0],
        endDate: reservation.endDate.toISOString().split('T')[0],
        createdAt: reservation.createdAt,
        updatedAt: reservation.updatedAt
      }

      updateReservations.push(fullReservationInfo);

    }

    //return requested response
    res.json({
      Reservations: updateReservations
    })
    
  } catch (error) {
    next(error)
  }
})

//edit a reservation
router.put('/:reservationId', requireAuth, async (req, res, next) => {
  try {
    //find reservation id
    const reservationId = req.params.reservationId;

    //find reservation by id
    const reservation = await Reservation.findByPk(reservationId)

    //404 - no reservation found
    if(!reservation){
      res.status(404)
      return res.json({
        message: "Reservation couldn't be found"
      })
    }

    //make sure that the logged in user owns the reservation
    if(reservation.userId !== req.user.id){
      res.status(403)
      return res.json({
        message: "Forbidden"
      })
    }

    //booking found - destructure from req.body
    const {startDate, endDate} = req.body
    let startDateUpdate;
    let endDateUpdate;

    //important dates
    const minAllowedDate = new Date('2018-01-01');
    let originalStartDate = reservation.startDate;
    let originalEndDate = reservation.endDate;
    const newReservationStartDate = new Date(startDate).getTime();
    const newReservationEndDate = new Date(endDate).getTime();
    const today = new Date().getTime();

    //managing start date
    if(startDate){
      startDateUpdate = startDate
    } else {
      startDateUpdate = reservation.startDate
    };

    if(endDate){
      endDateUpdate = endDate
    } else {
      endDateUpdate = reservation.endDate
    }

    //400 - bad request
    if(newReservationEndDate <= newReservationStartDate){
      res.status(400)
      res.json({
        message: "Bad Request",
        errors: {
          endDate: "endDate cannot be on or before startDate"
        }
      })
    } else if (newReservationStartDate < minAllowedDate){
      res.status(400)
      res.json({
        message: "Bad Request",
        errors: {
          startDate: "startDate cannot be in the past"
        }
      })
    }

    //set current res dates to a date that will never conflict
    await reservation.update({
      startDate: '2000-01-01',
      endDate: '2000-01-02'
    });

    //find all the reservations for the animal id (this should exclude the current deleted reservation)
    const animal = await Animal.findByPk(reservation.animalId)

    const reservations = await Reservation.findAll({
      where: {
        animalId: animal.id
      }
    });

    //iterate through existing reservations and make sure no conflicts
    for (let i = 0; i < reservations.length; i++){
      let resToCompare = reservations[i];

      //403 - checking requested dates v. all other booked dates
      let date1 = new Date(resToCompare.startDate).getTime();
      let date2 = new Date(resToCompare.endDate).getTime();

      //errors if overlap
      if(newReservationEndDate >= date1 && newReservationEndDate <= date2){
        //restore reservation
        await reservation.update({
          startDate: originalStartDate,
          endDate: originalEndDate
        });

        res.status(403)
          return res.json({
            message: 'Sorry, this animal is already reserved for the specified dates',
            errors: {
              startDate: 'Start date conflicts with an existing reservation',
              endDate: 'End date conflicts with an existing reservation'
            }
          })
        } else if(newReservationStartDate >= date1 && newReservationStartDate <= date2){
          //restore reservation
          await reservation.update({
            startDate: originalStartDate,
            endDate: originalEndDate
          });

          res.status(403)
          return res.json({
            message: 'Sorry, this animal is already reserved for the specified dates',
            errors: {
              startDate: 'Start date conflicts with an existing reservation',
              endDate: 'End date conflicts with an existing reservation'
            }
          })
        } else if(newReservationStartDate <= date1 && newReservationEndDate >= date2){
          //restore reservation
          await reservation.update({
            startDate: originalStartDate,
            endDate: originalEndDate
          });

          res.status(403)
          return res.json({
            message: 'Sorry, this animal is already reserved for the specified dates',
            errors: {
              startDate: 'Start date conflicts with an existing reservation',
              endDate: 'End date conflicts with an existing reservation'
            }
          })
        } else if(newReservationEndDate <= today){
          //restore reservation
          await reservation.update({
            startDate: originalStartDate,
            endDate: originalEndDate
          });

          res.status(403)
          return res.json({
            message: "Past reservations can't be modified"
          })
        } else if(newReservationStartDate === undefined || newReservationEndDate === undefined) {
          //restore reservation
          await reservation.update({
            startDate: originalStartDate,
            endDate: originalEndDate
          })
        }; 
      }

      //asses all restrictions - update
      let updatedReservation = await reservation.update({
        id: reservation.id,
        animalId: reservation.animalId,
        userId: reservation.userId,
        startDate: startDateUpdate,
        endDate: endDateUpdate
      })

      //return requested response
    res.json({
      id: parseInt(updatedReservation.id),
      spotId: parseInt(updatedReservation.spotId),
      userId: parseInt(updatedReservation.userId),
      startDate: updatedReservation.startDate.toISOString().split('T')[0],
      endDate: updatedReservation.endDate.toISOString().split('T')[0],
      createdAt: updatedReservation.createdAt,
      updatedAt: updatedReservation.updatedAt
    });
    
  } catch (error) {
    next(error)
  }
})

//delete a reservation
router.delete('/:reservationId', requireAuth, async(req, res, next) => {
  try {
    //find reservation id
    const reservationId = req.params.reservationId;

    //find resercation by id
    const reservation = await Reservation.findByPk(reservationId);

    //404 - no booking found
    if(!reservation){
      res.status(404)
      return res.json({
        message: "Reservation couldn't be found"
      })
    };

    //authorization - reservation must belong to current user OR reserved animal belongs to current user
    const animal = await Animal.findOne({
      where: {
        id: reservation.animalId
      }
    });

    if(reservation.userId !== req.user.id && animal.userId !== req.user.id){
      res.status(403)
      return res.json({
        message: "Forbidden"
      })
    };

    //403 - reservation already started
    const today = new Date().getTime();
    const startDate = new Date(reservation.startDate).getTime();

    if(startDate <= today){
      res.status(403)
      return res.json({
        message: "Reservations that have started can't be deleted"
      })
    };

    //reservation passes all restrictions - destroy
    const destroyedReservation = await reservation.destroy();

    //return requested response
    res.json({
      message: "Successfully deleted"
    });
    
  } catch (error) {
    next(error)
  }
})



module.exports = router;