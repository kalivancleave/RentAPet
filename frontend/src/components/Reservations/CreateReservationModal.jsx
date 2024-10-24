import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";

import { createReservation } from "../../store/reservations";
import { fetchAnimalReservations } from "../../store/reservations";
import { fetchOneAnimal } from "../../store/animals";

import Logo from '../../../../static/rentAPetLogoDark.png';

function CreateReservationModal(props) {
  const dispatch = useDispatch();
  const currentAnimal = useSelector(state => state.animals.animalDetails)
  const allReservations = useSelector(state => state.reservations.reservations)

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [errors, setErrors] = useState({})

  const { closeModal } = useModal();

  const animalId = props.animalId

  let minAllowedDate = new Date()
  let newReservationStartDate = new Date(startDate).getTime();
  let newReservationEndDate = new Date(endDate).getTime();

  async function wait() {
    await new Promise((resolve) => setTimeout(resolve))
  }

  const handleSubmit = async() => {
    setErrors({})

    //bad requests
    if(newReservationEndDate <= newReservationStartDate){
      setErrors({
        endDate: "End date cannot be on or before start date."
      })
    } else if (newReservationStartDate < minAllowedDate){
      setErrors({
        startDate: "Start date cannot be a date in the past."
      })
      return errors
    }

    //reservation conflicts
    for(let i = 0; i < allReservations.length; i++){
      let reservation = allReservations[i];

      let date1 = new Date(reservation.startDate).getTime();
      let date2 = new Date(reservation.endDate).getTime();

      if(newReservationEndDate >= date1 && newReservationEndDate <= date2){
        setErrors({
          startDate: "Dates conflict with an existing reservation.",
          endDate: "Dates conflict with an existing reservation."
        })
      } else if (newReservationStartDate >= date1 && newReservationStartDate <= date2){
        setErrors({
          startDate: "Dates conflict with an existing reservation.",
          endDate: "Dates conflict with an existing reservation."
        })
      } else if (newReservationStartDate <= date1 && newReservationEndDate >= date2){
        setErrors({
          startDate: "Dates conflict with an existing reservation.",
          endDate: "Dates conflict with an existing reservation."
        })
        return errors
      }
    }

    await dispatch(createReservation({
      startDate: startDate,
      endDate: endDate,
      animalId
    }))
    .then(async function reservationRefresh() {
      dispatch(fetchAnimalReservations(animalId))
      await wait();
    })
    .then(async function refreshAnimalDetails() {
      dispatch(fetchOneAnimal(animalId))
      await wait();
    })
    .then(closeModal)
  }

  let today  = new Date();
  let formattedDate = today.toISOString().split('T')[0];

  return (
    <div className='displayFlex flexColumn alignCenter'>
      <img className='smallLogo' src={Logo} />

      {console.log(allReservations)}
      <div className="displayFlex flexColumn alignCenter bottomPadding topPadding">
        <img className="imageShape" src={currentAnimal?.animalImage} />
        <p className='header xx-largeFont noMargin almostBlackFont'>Reserve {currentAnimal.name}</p>
      </div>

        <form className='displayFlex flexColumn littleMoreTopPadding' onSubmit={(e) => e.preventDefault()}>

          <div className='displayFlex alignCenter topPadding fullWidth spaceBetween'>
            <label className='largeFont displayFlex font almostBlackFont'>
              Start Date
            </label>

            <input
              onChange={(e) => setStartDate(e.target.value)}
              type="date"
              className='noBorder dropShadow logInInputSize littleMoreLeftMargin'
              value={startDate}
              min={formattedDate}
            />
          </div>
          <div>
            {errors.startDate && <p>{errors.startDate}</p>}
          </div>

          <div className='displayFlex alignCenter topPadding fullWidth spaceBetween'>
            <label className='largeFont displayFlex font almostBlackFont'>
              End Date
            </label>

            <input
              onChange={(e) => setEndDate(e.target.value)}
              type="date"
              className='noBorder dropShadow logInInputSize littleMoreLeftMargin'
              value={endDate}
            />
          </div>
          <div>
            {errors.endDate && <p>{errors.endDate}</p>}
          </div>

          <div className="fullWidth textCenter topMargin">
            <button onClick={handleSubmit}>Reserve Now!</button>
          </div>

        </form>
    </div>
  )
}

export default CreateReservationModal;