import { useDispatch } from "react-redux";
import { fetchReservations } from "../../store/reservations";
import { deleteReservation } from "../../store/reservations";
import { useModal } from "../../context/Modal";

function DeleteReservationModal(props) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  async function wait() {
    await new Promise((resolve) => setTimeout(resolve))
  } 

  const deleteReservationFunction = async () => {
    await dispatch(deleteReservation(props.reservationId))
    .then(async function refreshReservationsPage() {
      dispatch(fetchReservations())
      await wait();
    })
    .then(closeModal)
  }

  const doNotDelete = () => {closeModal()}

  return (
    <>
      <h1>Delete Reservation</h1>
      <p>Are you sure you want to delete this reservation?</p>
      {console.log(props.reservationId)}
      <button onClick={() => deleteReservationFunction()}>Yes</button>
      <button onClick={doNotDelete}>No</button>
    </>
  )
}

export default DeleteReservationModal;