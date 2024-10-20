import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

import { fetchReservations } from "../../store/reservations";

import OpenModalButton from "../OpenModalButton";
import DeleteReservationModal from "./DeleteReservationModal";
import UpdateReservationModal from "./UpdateReservationModal";

function GetReservationsPage() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.session.user)
  const currentReservations = useSelector(state => state.reservations.reservations)

  useEffect(() => {
    dispatch(fetchReservations())
  }, [dispatch])

  let props = {
    userId: "",
    reservationId: "",
    animalId: ""
  }

  return (
    <>
      <h1>User Reservations Page</h1>
      {console.log(currentReservations)}
      {props.userId = user.id}
      <ol>
        {currentReservations.map(({id, Animal, animalId, startDate, endDate, userId}) => (
          <div key={id}>
            <div className="visibilityHidden">
              {props.reservationId = id}
              {props.animalId = animalId}
            </div>
            <img src={Animal?.Image.url} />
            <p>{Animal?.name}</p>
            <p>{startDate}</p>
            <p>{endDate}</p>

            <div className={userId === user?.id ? "" : "visibilityHidden"}>
              <OpenModalButton
                  buttonText="Update"
                  modalComponent={<UpdateReservationModal {...props}/>}
                />
            </div>

            <div className={userId === user?.id ? "" : "visibilityHidden"}>
              <OpenModalButton
                  buttonText="Delete"
                  modalComponent={<DeleteReservationModal {...props}/>}
                />
            </div>
          </div>
        ))}
      </ol>
    </>
  )
}

export default GetReservationsPage;