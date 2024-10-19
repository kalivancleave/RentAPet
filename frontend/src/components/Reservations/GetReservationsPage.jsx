import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

import { fetchReservations } from "../../store/reservations";

function GetReservationsPage() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.session.user)
  const currentReservations = useSelector(state => state.reservations.reservations)

  useEffect(() => {
    dispatch(fetchReservations())
  }, [dispatch])

  return (
    <>
      <h1>User Reservations Page</h1>
      {console.log(currentReservations)}
      <ol>
        {currentReservations.map(({id, Animal, startDate, endDate}) => (
          <div key={id}>
            <img src={Animal.Image.url} />
            <p>{Animal.name}</p>
            <p>{startDate}</p>
            <p>{endDate}</p>
          </div>
        ))}
      </ol>
    </>
  )
}

export default GetReservationsPage;