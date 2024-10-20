import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { useModal } from "../../context/Modal";

import { updateReservation } from "../../store/reservations";
import { fetchReservations } from "../../store/reservations";

const UpdateReservationModal = (props) => {
  const reservationId = props.reservationId;
  const dispatch = useDispatch();
  const allReservations = useSelector(state => state?.reservations.reservations);
  const currentReservation = allReservations?.filter(reservation => reservation.id === reservationId);

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
    <>
      <h1>Update Reservation Modal</h1>
      {console.log(reservationId)}
      <p>Update your reservation</p>
      <form onSubmit={handleUpdate}>

        <label>
          Start Date
            <input
              onChange={(e) => setStartDate(e.target.value)}
              type="date"
              value={uStartDate}
              min={formattedDate}
            />
        </label>
        {errors.uStartDate && <p>{errors.uStartDate}</p>}

        <label>
          End Date
            <input
              onChange={(e) => setEndDate(e.target.value)}
              type="date"
              value={uEndDate}
            />
        </label>
        {errors.uEndDate && <p>{errors.uEndDate}</p>}

        <button onClick={handleUpdate}>Update</button>

      </form>
    </>
  )
}

export default UpdateReservationModal;