import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";

import { createReview } from "../../store/reviews";
import { fetchAnimalReviews } from "../../store/reviews";
import { fetchOneAnimal } from '../../store/animals';

import { IoPawSharp } from "react-icons/io5";


function CreateReviewModal(props) {
  const dispatch = useDispatch();
  const [review, setReview] = useState('');
  const [stars, setStars] = useState();
  const [hoverValue, setHoverValue] = useState(undefined);
  const [errors, setErrors] = useState({})

  const { closeModal } = useModal();

  const animalId = props.animalId

  async function wait() {
    await new Promise((resolve) => setTimeout(resolve))
  }

  const handleSubmit = async() => {
    setErrors({})
    await dispatch(createReview({
      review,
      stars,
      animalId
    }))
    .then(async function reviewRefresh() {
      dispatch(fetchAnimalReviews(animalId))
      await wait();
    })
    .then(async function refreshAnimalDetails() {
      dispatch(fetchOneAnimal(animalId))
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

  const colors = {
    green: "#32523A",
    grey: "#999999"
  }

  const starImages = Array(5).fill(0);

  return(
    <>
      <h1>Create Review Form </h1>
      <p>Rate This Pet</p>
      <form onSubmit={(e) => e.preventDefault()}>
        <textarea
          placeholder="Leave your review here..."
          onChange={(e) => setReview(e.target.value)}
        />
        {errors.review && <p>{errors.review}</p>}

        <div>
          {starImages.map((_, index) => {
            return (
              <IoPawSharp 
                key={index}
                className="xlargeFont cursorPointer"
                color={(hoverValue || stars) > index ? colors.green : colors.grey}
                onClick={() => handleClick(index +1)}
                onMouseOver={() => handleMouseOver(index + 1)}
                onMouseLeave={(handleMouseLeave)}
                value={stars}
              />
            )
          })}
          <label>Stars</label>
        </div>
        {errors.stars && <p>{errors.stars}</p>}

        <button onClick={handleSubmit}>Submit your review</button>

      </form>
    </>
  )
}

export default CreateReviewModal;