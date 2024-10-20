import { csrfFetch } from './csrf';

const GET_RESERVATIONS = 'reservations/GET_RESERVATIONS';
const GET_ANIMAL_RESERVATIONS = 'reservations/GET_ANIMAL_RESERVATIONS';
const DELETE_RESERVATION = 'reservations/DELETE';

//action creator
const getReservations = (reservations) => ({
  type: GET_RESERVATIONS,
  payload: reservations
})

const getAnimalReservations = (animalReservations) => ({
  type: GET_ANIMAL_RESERVATIONS,
  payload: animalReservations
})

const destroyReservation = (id) => ({
  type: DELETE_RESERVATION,
  payload: id
})

//thunks
//get all reservations for logged in user
export const fetchReservations = () => async(dispatch) => {
  const response = await fetch(`api/reservations/current`);

  if(response.ok) {
    const reservations = await response.json();
    dispatch(getReservations(reservations))
  }
}

//get all reservations for an animal
export const fetchAnimalReservations = (animalId) => async(dispatch) => {
  const response = await fetch(`api/animals/${animalId}/reservations`);

  if(response.ok) {
    const animalReservations = await response.json();
    dispatch(getAnimalReservations(animalReservations));
  }
}

//create a reservation
export const createReservation = (reservationDetails) => async(dispatch) => {
  const { startDate, endDate, animalId } = reservationDetails
  const response = await csrfFetch(`api/animals/${animalId}/reservations`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      startDate,
      endDate
    })
  })

  if(response.ok) {
    const data = await response.json();
    dispatch(fetchAnimalReservations(data.id))
  } else if (response.status < 500) {
    const data = await response.json();
    if (data.errors) return data.errors;
  } else {
    const data = await response.json();
    data.errors.push(['A server error occurred.'])
    return data.errors
  }
}

//update a reservation
export const updateReservation = (updatedReservation) => async(dispatch) => {
  const { id, startDate, endDate } = updatedReservation;
  const response = await csrfFetch(`api/reservations/${id}`, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      startDate,
      endDate
    })
  });

  if(response.ok){
    const data = response.json();
    dispatch(fetchAnimalReservations(data.animalId))
  } else if (response.status < 500) {
    const data = await response.json();
    if(data.errors) return data.errors;
  }
}

//delete a reservation
export const deleteReservation = (reservationId) => async(dispatch) => {
  const response = await csrfFetch(`api/reservations/${reservationId}`, {
    method: 'DELETE'
  })

  if(response.ok) {
    dispatch(destroyReservation(reservationId))
  } else if (response.status < 500) {
    const data = await response.json();
    if (data.errors) return data.errors
  }
}

const initialState = {reservations: [], isLoading: true}

//reducer

const reservationReducer = (state = initialState, action) => {
  let newState = Object.assign({}, state)
  switch(action.type) {
    case GET_RESERVATIONS:
      return {...state, reservations: [...action.payload.Reservations]}
    case GET_ANIMAL_RESERVATIONS:
      return {...state, reservations: [...action.payload.Reservations]}
    case DELETE_RESERVATION:
      delete newState[action.payload]
      delete newState.arr
      newState.arr = Object.values(newState)
      return newState
    default:
      return state
  }
}

export default reservationReducer;