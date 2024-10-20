import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { useModal } from "../../context/Modal";

import { updateReview } from "../../store/reviews";
import { fetchAnimalReviews } from "../../store/reviews";

import { IoPawSharp } from "react-icons/io5";

const UpdateReviewModal = (props) => {
  const reviewId = props.reviewId
  const dispatch = useDispatch();
  const allReviews = useSelector(state => state?.reviews.reviews)
  let currentReview = allReviews?.filter(review => review.id === reviewId);
  
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
    return dispatch(updateReview(updatedReview))
    .then(async function refreshReviewDetails() {
      dispatch(fetchAnimalReviews(props.animalId))
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
    <>
      <h1>Update Review Modal</h1>
      {console.log(currentReview[0].id)}
      <p>Update your review</p>
      <form onSubmit={handleUpdate}>
        <textarea
          placeholder="Please leave your review here..."
          onChange={(e) => setReview(e.target.value)}
          value={uReview}
        />
        {errors.review && <p>{errors.review}</p>}

        <div>
          {starImages.map((_, index) => {
            return (
              <IoPawSharp 
                key={index}
                className="xlargeFont cursorPointer"
                color={(hoverValue || uStars) > index ? colors.green : colors.grey}
                onClick={() => handleClick(index +1)}
                onMouseOver={() => handleMouseOver(index + 1)}
                onMouseLeave={(handleMouseLeave)}
                value={uStars}
              />
            )
          })}
          <label>Stars</label>
        </div>
        {errors.stars && <p>{errors.stars}</p>}

        <button onClick={handleUpdate}>Update</button>
      </form>

    </>
  )
}

export default UpdateReviewModal
