import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";

import { createReservation } from "../../store/reservations";
import { fetchAnimalReservations } from "../../store/reservations";
import { fetchOneAnimal } from "../../store/animals";

function CreateReservationModal(props) {
  const dispatch = useDispatch();
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
    <>
      <h1>Create Reservation Modal</h1>
      <p>Reserve This Pet</p>
      {console.log(startDate)}
      <form onSubmit={(e) => e.preventDefault()}>
        <label>
          Start Date
            <input
              onChange={(e) => setStartDate(e.target.value)}
              type="date"
              value={startDate}
              min={formattedDate}
            />
        </label>
        {errors.startDate && <p>{errors.startDate}</p>}

        <label>
          End Date
            <input
              onChange={(e) => setEndDate(e.target.value)}
              type="date"
              value={endDate}
            />
        </label>
        {errors.endDate && <p>{errors.endDate}</p>}

        <button onClick={handleSubmit}>Reserve Now!</button>
      </form>
    </>
  )
}

export default CreateReservationModal;