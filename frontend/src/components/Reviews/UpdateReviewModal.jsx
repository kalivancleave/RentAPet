import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { useModal } from "../../context/Modal";

import { updateReview } from "../../store/reviews";
import { fetchAnimalReviews } from "../../store/reviews";
import { fetchOneAnimal } from "../../store/animals";

import { IoPawSharp } from "react-icons/io5";

import Logo from '../../../../static/rentAPetLogoDark.png';

const UpdateReviewModal = (props) => {
  const reviewId = props.reviewId
  const dispatch = useDispatch();
  const allReviews = useSelector(state => state?.reviews.reviews)
  let currentReview = allReviews?.filter(review => review.id === reviewId);
  const currentAnimal = useSelector(state => state.animals.animalDetails)
  
  const [uReview, setReview] = useState(currentReview[0].review);
  const [uStars, setStars] = useState(currentReview[0].stars);
  const [hoverValue, setHoverValue] = useState(undefined);
  const [errors, setErrors] = useState({})
  
  const { closeModal } = useModal();

  const updatedReview = {
    id: reviewId,
    review: uReview,
    stars: uStars
  }

  async function wait() {
    await new Promise((resolve) => setTimeout(resolve))
  }

  const handleUpdate = (e) => {
    e.preventDefault();
    setErrors({})

    if(uReview.length < 10) {
      setErrors({
        review: "Review length must be longer than 10 characters."
      })
    } else if (uReview.length > 256) {
      setErrors({
        review: "Review lenght must be less than 256 characters."
      })
      return errors
    }

    return dispatch(updateReview(updatedReview))
    .then(async function refreshReviewDetails() {
      dispatch(fetchAnimalReviews(props.animalId))
      await wait();
    })
    .then(async function refreshAnimalDetails() {
      dispatch(fetchOneAnimal(props.animalId))
      await wait();
    })
    .then(closeModal)
  }

  const handleClick = (stars) => {
    setStars(stars)
  };

  const handleMouseOver = (stars) => {
    setHoverValue(stars)
  };

  const handleMouseLeave = () => {
    setHoverValue(undefined)
  };

  const starImages = Array(5).fill(uStars);

  const colors = {
    green: "#32523A",
    grey: "#999999"
  }

  return (
    <div className='displayFlex flexColumn alignCenter'>
      <img className='smallLogo' src={Logo} />

      <div className="displayFlex flexColumn alignCenter bottomPadding topPadding">
        <p className='header xx-largeFont noMargin almostBlackFont'>Update Review</p>
        <img className="imageShape" src={currentAnimal?.animalImage} />
      </div>

        <form className='displayFlex flexColumn littleMoreTopPadding' onSubmit={handleUpdate}>

        <div className='displayFlex alignCenter topPadding fullWidth spaceBetween alignTop'>
            <label className='largeFont displayFlex font almostBlackFont'>
              Thoughts
            </label>

          <textarea
            placeholder="Please leave your review here..."
            onChange={(e) => setReview(e.target.value)}
            className='noBorder dropShadow textAreaSize littleMoreLeftMargin'
            value={uReview}
          />
        </div>
        <div>
          {errors.review && <p>{errors.review}</p>}
        </div>

        <div className='displayFlex alignCenter topPadding fullWidth spaceEvenly'>
          <label className='largeFont displayFlex font almostBlackFont'>
            Stars
          </label>
            
          {starImages.map((_, index) => {
            return (
              <IoPawSharp 
                key={index}
                className="xx-largeFont cursorPointer"
                color={(hoverValue || uStars) > index ? colors.green : colors.grey}
                onClick={() => handleClick(index +1)}
                onMouseOver={() => handleMouseOver(index + 1)}
                onMouseLeave={(handleMouseLeave)}
                value={uStars}
              />
            )
          })}
        {errors.stars && <p>{errors.stars}</p>}
        </div>

        <div className="fullWidth textCenter topMargin">
          <button onClick={handleUpdate}>Update</button>
        </div>

      </form>

    </div>
  )
}

export default UpdateReviewModal
