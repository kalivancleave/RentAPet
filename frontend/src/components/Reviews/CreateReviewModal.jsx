import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";

import { createReview } from "../../store/reviews";
import { fetchAnimalReviews } from "../../store/reviews";
import { fetchOneAnimal } from '../../store/animals';

import { IoPawSharp } from "react-icons/io5";

import Logo from '../../../../static/rentAPetLogoDark.png';


function CreateReviewModal(props) {
  const dispatch = useDispatch();
  const currentAnimal = useSelector(state => state.animals.animalDetails)
  const animalReviews = useSelector(state => state.reviews.reviews)
  const user = useSelector(state => state.session.user)
  const userReview = animalReviews.find(review => review.userId === user.id)

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

    if(review.length < 10) {
      setErrors({
        review: "Review length must be longer than 10 characters."
      })
    } else if (review.length > 256) {
      setErrors({
        review: "Review lenght must be less than 256 characters."
      })
      return errors
    }
    

    if(userReview) {
      setErrors({
        stars: "You already created a review."
      })
      return errors
    }

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
    <div className='displayFlex flexColumn alignCenter'>
      <img className='smallLogo' src={Logo} />
      {console.log(errors)}

      <div className="displayFlex alignBottom bottomPadding topPadding">
        <img className="imageShape" src={currentAnimal?.animalImage} />
        <p className='header xx-largeFont noMargin almostBlackFont'>Review {currentAnimal.name}</p>
      </div>

        <form className='displayFlex flexColumn littleMoreTopPadding' onSubmit={(e) => e.preventDefault()}>

          <div className='displayFlex alignCenter topPadding fullWidth spaceBetween alignTop'>
            <label className='largeFont displayFlex font almostBlackFont'>
              Thoughts
            </label>

            <textarea
              placeholder="Leave your review here..."
              className='noBorder dropShadow textAreaSize littleMoreLeftMargin'
              onChange={(e) => setReview(e.target.value)}
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
                  color={(hoverValue || stars) > index ? colors.green : colors.grey}
                  onClick={() => handleClick(index +1)}
                  onMouseOver={() => handleMouseOver(index + 1)}
                  onMouseLeave={(handleMouseLeave)}
                  value={stars}
                />
              )
            })}
          </div>
          <div>
            {errors.stars && <p>{errors.stars}</p>}
          </div>

          <div className="fullWidth textCenter topMargin">
            <button onClick={handleSubmit}>Review</button>
          </div>

      </form>
    </div>
  )
}

export default CreateReviewModal;