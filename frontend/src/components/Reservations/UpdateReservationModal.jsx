import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { useModal } from "../../context/Modal";

import { updateReservation } from "../../store/reservations";
import { fetchReservations } from "../../store/reservations";

import Logo from '../../../../static/rentAPetLogoDark.png';

const UpdateReservationModal = (props) => {
  const reservationId = props.reservationId;
  const dispatch = useDispatch();
  const allReservations = useSelector(state => state?.reservations.reservations);
  const currentReservation = allReservations?.filter(reservation => reservation.id === reservationId);
  const currentAnimal = useSelector(state => state.animals.animalDetails)

  const [uStartDate, setStartDate] = useState(currentReservation[0].startDate);
  const [uEndDate, setEndDate] = useState(currentReservation[0].endDate);
  const [errors, setErrors] = useState({})

  const { closeModal } = useModal();

  const updatedReservation = {
    id: reservationId,
    startDate: uStartDate,
    endDate: uEndDate
  }

  async function wait() {
    await new Promise((resolve) => setTimeout(resolve))
  }

  const handleUpdate = (e) => {
    setErrors({})
    e.preventDefault();
    return dispatch(updateReservation(updatedReservation))
    .then(async function refreshReservationDetails() {
      dispatch(fetchReservations())
      await wait();
    })
    .then(closeModal)
  }

  let today  = new Date();
  let formattedDate = today.toISOString().split('T')[0];

  return (
    <div className='displayFlex flexColumn alignCenter'>
      <img className='smallLogo' src={Logo} />
        
      <div className="displayFlex flexColumn alignCenter bottomPadding topPadding">
        <img className="imageShape" src={currentAnimal?.animalImage} />
        <p className='header xx-largeFont noMargin almostBlackFont'>Update Reservation</p>
      </div>

        <form className='displayFlex flexColumn littleMoreTopPadding' onSubmit={handleUpdate}>

          <div className='displayFlex alignCenter topPadding fullWidth spaceBetween'>
            <label className='largeFont displayFlex font almostBlackFont'>
              Start Date
            </label>

            <input
              onChange={(e) => setStartDate(e.target.value)}
              type="date"
              className='noBorder dropShadow logInInputSize littleMoreLeftMargin'
              value={uStartDate}
              min={formattedDate}
            />

            {errors.uStartDate && <p>{errors.uStartDate}</p>}
          </div>

          <div className='displayFlex alignCenter topPadding fullWidth spaceBetween'>
            <label className='largeFont displayFlex font almostBlackFont'>
              End Date
            </label>

            <input
              onChange={(e) => setEndDate(e.target.value)}
              type="date"
              className='noBorder dropShadow logInInputSize littleMoreLeftMargin'
              value={uEndDate}
            />

            {errors.uEndDate && <p>{errors.uEndDate}</p>}
          </div>

          <div className="fullWidth textCenter topMargin">
            <button onClick={handleUpdate}>Update</button>
          </div>

        </form>
    </div>
  )
}

export default UpdateReservationModal;