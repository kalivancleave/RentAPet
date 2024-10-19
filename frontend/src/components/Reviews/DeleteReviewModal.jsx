import { useDispatch } from 'react-redux';
import { fetchAnimalReviews } from '../../store/reviews';
import { deleteReview } from '../../store/reviews';
import { fetchOneAnimal } from '../../store/animals';
import { useModal } from '../../context/Modal';

function DeleteReviewModal(props) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  async function wait() {
    await new Promise((resolve) => setTimeout(resolve))
  }

  const deleteReviewFunction = async() => {
    await dispatch(deleteReview(props.reviewId))
    .then(async function refreshAnimalReviews() {
      dispatch(fetchAnimalReviews(props.animalId))
      await wait();
    })
    .then(async function refreshAnimalDetails() {
      dispatch(fetchOneAnimal(props.animalId))
      await wait();
    })
    .then(closeModal)
  }

  const doNotDelete = () => {closeModal()}


  return(
    <>
      <h1>Delete Review Modal</h1>
      {console.log(JSON.stringify(props))}
      <p>Are you sure you want to delete this review?</p>
      <button onClick={() => deleteReviewFunction()}>Yes</button>
      <button onClick={doNotDelete}>No</button>
    </>
  )
}

export default DeleteReviewModal;