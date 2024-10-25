import { useDispatch } from 'react-redux';
import { fetchAnimalReviews } from '../../store/reviews';
import { deleteReview } from '../../store/reviews';
import { fetchOneAnimal } from '../../store/animals';
import { useModal } from '../../context/Modal';

import Logo from '../../../../static/rentAPetLogoDark.png';

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
    <div className='displayFlex flexColumn alignCenter'>
      <img className='smallLogo' src={Logo} />

        <div className='displayFlex justifyContentCenter topPadding fullWidth spaceBetween'>
          <p className='header xx-largeFont noMargin almostBlackFont'>Are you sure you want to delete this review?</p>
        </div>

        <div className="displayFlex flexColumn fullWidth alignCenter topMargin textCenter">
          <button onClick={() => deleteReviewFunction()}>Yes</button>
          <button className="subtleButton" onClick={doNotDelete}>No, keep my review</button>
        </div>
    </div>
  )
}

export default DeleteReviewModal;