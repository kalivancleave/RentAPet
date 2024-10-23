import { useDispatch, useSelector } from "react-redux";
import { fetchReservations } from "../../store/reservations";
import { deleteReservation } from "../../store/reservations";
import { useModal } from "../../context/Modal";

import Logo from '../../../../static/rentAPetLogoDark.png';
import { fetchOneAnimal } from "../../store/animals";

function DeleteReservationModal(props) {
  const dispatch = useDispatch();
  const currentAnimal = useSelector(state => state.animals.animalDetails);
  const { closeModal } = useModal();

  async function wait() {
    await new Promise((resolve) => setTimeout(resolve))
  } 

  const deleteReservationFunction = async () => {
    await dispatch(deleteReservation(props.reservationId))
    .then(async function refreshReservationsPage() {
      dispatch(fetchReservations(props.animalId))
      await wait();
    })
    .then(async function refreshAnimalDetails() {
      dispatch(fetchOneAnimal(props.animalId))
      await wait();
    })
    .then(closeModal)
  }

  const doNotDelete = () => {closeModal()}

  return (
    <div className='displayFlex flexColumn alignCenter'>
      <img className='smallLogo' src={Logo} />

        <div className='displayFlex justifyContentCenter topPadding fullWidth spaceBetween'>
          <p className='header xx-largeFont noMargin almostBlackFont'>Are you sure you want to delete your reservation?</p>
        </div>

        <div className='displayFlex justifyContentCenter topPadding fullWidth spaceBetween'>
          <img className="largeImageShape" src={currentAnimal?.animalImage} />
        </div>

        <div className="displayFlex flexColumn fullWidth alignCenter topMargin textCenter">
          <button onClick={() => deleteReservationFunction()}>Yes</button>
          <button className="subtleButton" onClick={doNotDelete}>No, keep my reservation with {currentAnimal.name}</button>
        </div>
    </div>
  )
}

export default DeleteReservationModal;