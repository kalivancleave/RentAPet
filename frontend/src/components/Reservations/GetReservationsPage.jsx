import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

import { fetchReservations } from "../../store/reservations";


function GetReservationsPage() {
  const dispatch = useDispatch();
  // const user = useSelector(state => state.session.user)
  const currentReservations = useSelector(state => state.reservations.reservations)

  useEffect(() => {
    dispatch(fetchReservations())
  }, [dispatch])

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

  // let props = {
  //   userId: user?.id,
  //   animalId: "",
  //   reservationId: ""
  // }

  function sendAlert() {
    alert("Feature coming soon!")
  }

  return (
    <>
      {/* <div className="visibilityHidden">
        {props.userId = user.id}
      </div> */}

      {console.log(currentReservations)}

      <div className="displayFlex noPadding flexWrap leftPageBorder rightPageBorder justifyContentCenter topMargin">
        {currentReservations.map(({id, Animal, startDate, endDate}) => (
          <div key={id} className="displayFlex flexColumn alignCenter littleMoreMargin dropShadow frontPageCards">
            {/* <div className="visibilityHidden">
              {props.reservationId = id}
              {props.animalId = animalId}
            </div> */}

            <div className="displayFlex flexColumn fullWidth alignCenter">
              <div className="displayFlex">
                <img className='imageShape' src={Animal?.Image.url} />
                <p className="font almostBlackFont xx-largeFont leftPadding">{Animal?.name}</p>
              </div>
              <div className="displayFlex alignBottom">
                <p className="noMargin header mediumFont almostBlackFont">{displayMonth(startDate.slice(5,7))} {startDate.slice(8,10)}, {startDate.slice(0,4)} - {displayMonth(endDate.slice(5,7))} {endDate.slice(8,10)}, {endDate.slice(0,4)}</p>
              </div>
            </div>

            <div className='displayFlex'>
              <button className="subtleButton" onClick={sendAlert}>Update</button>
              <button className="subtleButton" onClick={sendAlert}>Delete</button>

             {/* <div className={userId === user?.id ? "" : "visibilityHidden"}>
                <SubtleOpenModalButton
                    buttonText="Delete"
                    modalComponent={<AltDeleteReservationModal {...props}/>}
                    />
              </div>
              <div className={userId === user?.id ? "" : "visibilityHidden"}>
                <SubtleOpenModalButton
                    buttonText="Update"
                    modalComponent={<AltUpdateReservationModal {...props}/>}
                    />
              </div> */}
            </div>
          </div>
        ))}
      </div>

    
      
      <ol>
        
      </ol>
    </>
  )
}

export default GetReservationsPage;