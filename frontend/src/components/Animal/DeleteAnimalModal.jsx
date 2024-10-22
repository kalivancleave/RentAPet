import { useDispatch, useSelector } from "react-redux";
import { fetchAnimals } from "../../store/animals";
import { deleteAnimal } from "../../store/animals";
import { useModal } from "../../context/Modal";

import Logo from '../../../../static/rentAPetLogoDark.png';

function DeleteAnimalModal(props) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const currentAnimal = useSelector(state => state.animals.animalDetails)

  async function wait() {
    await new Promise((resolve) => setTimeout(resolve))
  }

  const deleteAnimalFunction = async() => {
    await dispatch(deleteAnimal(props.animalId))
    .then (async function refreshAnimals() {
      dispatch(fetchAnimals())
      await wait();
    })
    .then(window.location.href = '/')
    .then(closeModal)
  }

  const doNotDelete = () => {closeModal()}

  return(
    <div className='displayFlex flexColumn alignCenter'>
      <img className='smallLogo' src={Logo} />

        <div className='displayFlex justifyContentCenter topPadding fullWidth spaceBetween'>
          <p className='header xx-largeFont noMargin almostBlackFont'>Are you sure you want to delete this animal?</p>
        </div>

        <div className='displayFlex justifyContentCenter topPadding fullWidth spaceBetween'>
          <img className="largeImageShape" src={currentAnimal?.animalImage} />
        </div>
        
        <div className="displayFlex flexColumn fullWidth alignCenter topMargin textCenter">
          <button onClick={() => deleteAnimalFunction()}>Yes</button>
          <button className="subtleButton" onClick={doNotDelete}>No, keep {currentAnimal.name}</button>
        </div>
    </div>
  )
}

export default DeleteAnimalModal;