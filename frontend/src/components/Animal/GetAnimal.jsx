import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';

import { fetchOneAnimal } from '../../store/animals';
import { fetchAnimalReviews } from '../../store/reviews';

import OpenModalButton from '../OpenModalButton';
import DeleteReviewModal from '../Reviews/DeleteReviewModal';
import CreateReviewModal from '../Reviews/CreateReviewModal';
import UpdateReviewModal from '../Reviews/UpdateReviewModal';
import DeleteAnimalModal from './DeleteAnimalModal';
import UpdateAnimalModal from './UpdateAnimalModal';
import CreateReservationModal from '../Reservations/CreateReservationModal';


const GetAnimal = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const animalInfo = useSelector(state => state.animals.animalDetails)
  const animalReviews = useSelector(state => state.reviews.reviews)

  const user = useSelector(state => state.session.user)

  useEffect(() => {
    dispatch(fetchOneAnimal(id))
    dispatch(fetchAnimalReviews(id))
  }, [dispatch, id])

  function displayMonth(number) {
    if(number === "01") return "January"
    if(number === "02") return "February"
    if(number === "03") return "March"
    if(number === "04") return "April"
    if(number === "05") return "May"
    if(number === "06") return "June"
    if(number === "07") return "July"
    if(number === "08") return "August"
    if(number === "09") return "September"
    if(number === "10") return "October"
    if(number === "11") return "November"
    if(number === "12") return "December"
  }

  let props = {
    animalId: "",
    reviewId: "",
  }

  return (
    <>
      <h1>Animal #{id}</h1>
      <div className='visibilityHidden'>
        {props.animalId = id}
      </div>
      <div className={animalInfo?.ownerId === user?.id ? "" : "visibilityHidden"}>
        <OpenModalButton
            buttonText="Delete Animal"
            modalComponent={<DeleteAnimalModal {...props}/>}
          />
      </div>
      <div className={animalInfo?.ownerId === user?.id ? "" : "visibilityHidden"}>
        <OpenModalButton
            buttonText="Update Animal"
            modalComponent={<UpdateAnimalModal {...props}/>}
          />
      </div>
      {console.log(animalInfo)}
      <h2>{animalInfo?.name}</h2>
      <div className={user && user.id !== animalInfo?.ownerId ? "" : "visibilityHidden"}>
        <OpenModalButton
            buttonText="Reserve"
            modalComponent={<CreateReservationModal {...props}/>}
          />
      </div>
      <img src={animalInfo?.animalImage} />
      <p>{animalInfo?.averageStars}</p>
      <p>{animalInfo?.type}</p>
      <p>{animalInfo?.birthday}</p>
      <p>{animalInfo?.price}</p>

      <h2>Reviews</h2>
      {/* import reviews display */}
      {console.log(animalReviews)}
      <div className='noDecoration'>
        {animalReviews?.map(({id, review, User, stars, createdAt}) => (
          <div key={id}>
              {props.reviewId = id}
              <p>{`${User.firstName} ${User.lastName}`}</p>
              <p>{displayMonth(createdAt.slice(5,7))} {createdAt.slice(0,4)}</p>
              <p>{review}</p>
              <p>{stars}</p>
            <div className={User.id === user?.id ? "" : "visibilityHidden"}>
              <OpenModalButton
                  buttonText="Delete"
                  modalComponent={<DeleteReviewModal {...props}/>}
                />
            </div>
            <div className={User.id === user?.id ? "" : "visibilityHidden"}>
              <OpenModalButton
                  buttonText="Update"
                  modalComponent={<UpdateReviewModal {...props}/>}
                />
            </div>
          </div>
        ))}
      </div>

      <OpenModalButton
          buttonText="Review This Pet"
          modalComponent={<CreateReviewModal animalId={id} />}
        />
    </>
  )

}

export default GetAnimal;