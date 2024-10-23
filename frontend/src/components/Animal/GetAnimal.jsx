import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { IoPawSharp } from "react-icons/io5";

import { fetchOneAnimal } from '../../store/animals';
import { fetchAnimalReviews } from '../../store/reviews';
import { fetchAnimalReservations } from '../../store/reservations';

import OpenModalButton from '../OpenModalButton';
import SubtleOpenModalButton from '../OpenModalButton/SubtleOpenModalButton';
import DeleteReviewModal from '../Reviews/DeleteReviewModal';
import CreateReviewModal from '../Reviews/CreateReviewModal';
import UpdateReviewModal from '../Reviews/UpdateReviewModal';
import DeleteAnimalModal from './DeleteAnimalModal';
import UpdateAnimalModal from './UpdateAnimalModal';
import CreateReservationModal from '../Reservations/CreateReservationModal';
import UpdateReservationModal from '../Reservations/UpdateReservationModal';
import DeleteReservationModal from '../Reservations/DeleteReservationModal';
import Calendar from '../Calendar/Calendar';


const GetAnimal = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const animalInfo = useSelector(state => state.animals.animalDetails)
  const animalReviews = useSelector(state => state.reviews.reviews)
  const animalReservations = useSelector(state => state.reservations.reservations)

  const user = useSelector(state => state.session.user)

  useEffect(() => {
    dispatch(fetchOneAnimal(id))
    dispatch(fetchAnimalReviews(id))
    dispatch(fetchAnimalReservations(id))
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
    userId: user?.id,
    animalId: "",
    reviewId: "",
    reservationId: ""
  }

  return (
    <div className='displayFlex flexColumn rightPageBorder leftPageBorder topMargin'>
      <div className='displayFlex spaceBetween alignCenter'>
        <div className='displayFlex'>
          <div className='visibilityHidden'>
            {props.animalId = id}
          </div>
          <div className={animalInfo?.ownerId === user?.id ? "littleRightMargin" : "visibilityHidden"}>
            <OpenModalButton
                buttonText="Delete Animal"
                modalComponent={<DeleteAnimalModal {...props}/>}
              />
          </div>
          <div className={animalInfo?.ownerId === user?.id ? "littleLeftMargin" : "visibilityHidden"}>
            <OpenModalButton
                buttonText="Update Animal"
                modalComponent={<UpdateAnimalModal {...props}/>}
              />
          </div>
        </div>
        {console.log(animalInfo)}
        <div className={user && user?.id !== animalInfo?.ownerId ? "" : "visibilityHidden"}>
          <OpenModalButton
              buttonText="Reserve"
              modalComponent={<CreateReservationModal {...props}/>}
            />
        </div>
      </div>

      <div className='displayFlex justifyContentCenter topMargin alignCenter'>
        <div className='quarterWidth moreBottomPadding'>
          <div className='textCenter'>
            <p className='xx-largeFont header almostBlackFont noMargin padding'>{animalInfo?.name}</p>
          </div>
          <div className='textCenter'>
            <img className="largeImageShape" src={animalInfo?.animalImage} />
          </div>
        </div>

        <div className='quarterWidth'>
          <div className='displayFlex alignBottom justifyContentRight littleMoreBottomPadding'>
            <p className="noMargin header mediumFont almostBlackFont">{typeof animalInfo?.averageStars === 'number' ? animalInfo?.averageStars.toFixed(1) : "New"}</p>
            <IoPawSharp className="x-largeFont font darkGreenFont littleLeftMargin"/>
          </div>

          <div className="displayFlex alignBottom spaceBetween">
            <p className="noMargin font mediumFont almostBlackFont">Birthday</p>
            <p className="noMargin header mediumFont almostBlackFont">{displayMonth(animalInfo?.birthday.slice(5,7))} {animalInfo?.birthday.slice(8,10)}, {animalInfo?.birthday.slice(0,4)}</p>
          </div>

          <div className="displayFlex alignBottom spaceBetween littleTopPadding">
            <p className="noMargin font mediumFont almostBlackFont">Price</p>
            <p className="noMargin header mediumFont almostBlackFont">${animalInfo?.price.toFixed(2)} per night</p>
          </div>

          <div className="displayFlex alignBottom spaceBetween littleTopPadding">
            <p className="noMargin font mediumFont almostBlackFont">Type</p>
            <p className="noMargin header mediumFont almostBlackFont">{animalInfo?.type}</p>
          </div>
        </div>
      </div>

      <div className='displayFlex topMargin'>
        <div className='halfWidth padding'>
          <div className='displayFlex alignCenter bottomMargin justifyContentCenter'>
            <p className='xx-largeFont header almostBlackFont noMargin'>Reviews</p>
            <div className={user ? "leftPageBorder" : "visibilityHidden"}>
              <OpenModalButton
                  buttonText={`Review ${animalInfo?.name}`}
                  modalComponent={<CreateReviewModal animalId={id} />}
                />
            </div>
          </div>

          {console.log(animalReviews)}
          <div className='displayFlex spaceEvenly'>
            <div className='noDecoration'>
              {animalReviews?.map(({id, review, User, stars, createdAt}) => (
                <div key={id} className='reviewCards dropShadow moreBottomMargin'>
                  <div className='visibilityHidden'>
                    {props.reviewId = id}
                  </div>

                  <div className='displayFlex spaceBetween'>
                    <div className="displayFlex alignBottom spaceBetween littleTopPadding">
                      <p className="noMargin header mediumFont almostBlackFont">{displayMonth(createdAt?.slice(5,7))} {createdAt?.slice(8,10)} {createdAt?.slice(0,4)}</p>
                    </div>

                    <div className='displayFlex alignBottom'>
                      <p className="noMargin header mediumFont almostBlackFont">{stars}</p>
                      <IoPawSharp className="x-largeFont font darkGreenFont littleLeftMargin"/>
                    </div>
                  </div>  

                  <div className="displayFlex alignBottom spaceBetween littleTopPadding">
                    <p className="noMargin font xx-largeFont almostBlackFont">&quot;</p>
                    <p className="noMargin header mediumFont almostBlackFont">{review}</p>
                    <p className="noMargin font xx-largeFont almostBlackFont">&quot;</p>
                  </div>

                  <div className="displayFlex alignBottom spaceBetween littleTopPadding justifyContentRight">
                    <p className="noMargin font mediumFont almostBlackFont">~{`${User.firstName} ${User.lastName}`}</p>
                  </div>

                  <div className='displayFlex'>
                    <div className={User.id === user?.id ? "" : "visibilityHidden"}>
                      <SubtleOpenModalButton
                          buttonText="Delete"
                          modalComponent={<DeleteReviewModal {...props}/>}
                          />
                    </div>
                    <div className={User.id === user?.id ? "" : "visibilityHidden"}>
                      <SubtleOpenModalButton
                          buttonText="Update"
                          modalComponent={<UpdateReviewModal {...props}/>}
                          />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className='halfWidth padding'>
          <div className='displayFlex alignCenter bottomMargin justifyContentCenter'>
            <p className='xx-largeFont header almostBlackFont noMargin'>Reservations</p>
          </div>
          <Calendar />

          {console.log(animalReservations)}
          <div className='displayFlex flexColumn alignCenter topPadding'>
            <p className='mediumFont header almostBlackFont noMargin littleBottomPadding'>Currently Booked Dates:</p>
              {animalReservations?.map(({id, startDate, endDate, User}) => (
                <div key={id} className='displayFlex flexColumn dropShadow reservationCards moreBottomMargin'>
                  <div className='visibilityHidden'>
                    {props.reservationId = id}
                  </div>
                  <p className="noMargin font mediumFont almostBlackFont">{User?.firstName}</p>
                  <p className="noMargin header mediumFont almostBlackFont littleMoreTopPadding textCenter">{displayMonth(startDate.slice(5,7))} {startDate.slice(8,10)}, {startDate.slice(0,4)} - {displayMonth(endDate.slice(5,7))} {endDate.slice(8,10)}, {endDate.slice(0,4)}</p>
                  
                  <div className='displayFlex'>
                    <div className={User.id === user?.id ? "" : "visibilityHidden"}>
                      <SubtleOpenModalButton
                          buttonText="Delete"
                          modalComponent={<DeleteReservationModal {...props}/>}
                          />
                    </div>
                    <div className={User.id === user?.id ? "" : "visibilityHidden"}>
                      <SubtleOpenModalButton
                          buttonText="Update"
                          modalComponent={<UpdateReservationModal {...props}/>}
                          />
                    </div>
                  </div>
                </div> 
              ))}
          </div> 
        </div>

      </div>

      
    </div>
  )

}

export default GetAnimal;