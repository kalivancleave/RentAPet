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

  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [errors, setErrors] = useState({})

  const { closeModal } = useModal();

  const animalId = props.animalId

  async function wait() {
    await new Promise((resolve) => setTimeout(resolve))
  }

  const handleSubmit = async() => {
    setErrors({})
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

      {console.log(props)}
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