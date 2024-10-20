import { useDispatch } from "react-redux";
import { fetchAnimals } from "../../store/animals";
import { deleteAnimal } from "../../store/animals";
import { useModal } from "../../context/Modal";

function DeleteAnimalModal(props) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

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
    <>
      <h1>Delete Animal Modal</h1>
      <p>Are you sure you want to delete this animal?</p>
      <div>
        <button onClick={() => deleteAnimalFunction()}>Yes</button>
        <button onClick={doNotDelete}>No</button>
      </div>
    </>
  )
}

export default DeleteAnimalModal;