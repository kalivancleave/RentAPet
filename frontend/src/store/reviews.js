import { csrfFetch } from './csrf';

const GET_REVIEWS = 'reviews/GET_REVIEWS';
const GET_ANIMAL_REVIEWS = 'reviews/GET_ANIMAL_REVIEWS';
const DELETE_REVIEW = 'reviews/DELETE';

//action creator
const getReviews = (reviews) => ({
  type: GET_REVIEWS,
  payload: reviews
})

const getAnimalReviews = (animalReviews) => ({
  type: GET_ANIMAL_REVIEWS,
  payload: animalReviews
})

const destroyReview = (id) => ({
  type: DELETE_REVIEW,
  payload: id
})


//thunks
//get all reviews
export const fetchReviews = () => async(dispatch) => {
  const response = await fetch(`api/reviews`);

  if(response.ok) {
    const reviews = await response.json();
    dispatch(getReviews(reviews));
  }
}

//get all reviews for an animal
export const fetchAnimalReviews = (animalId) => async(dispatch) => {
  const response = await fetch(`api/animals/${animalId}/reviews`);

  if(response.ok) {
    const animalReviews = await response.json();
    dispatch(getAnimalReviews(animalReviews));
  }
}

//create a review
export const createReview = (reviewDetails) => async(dispatch) => {
  const {review, stars, animalId} = reviewDetails
  const response = await csrfFetch(`api/animals/${animalId}/reviews`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      review,
      stars
    })
  })

  if(response.ok) {
    const data = await response.json();
    dispatch(fetchAnimalReviews(data.id))
  } else if (response.status < 500) {
    const data = await response.json();
    if (data.errors) return data.errors;
  } else {
    const data = await response.json();
    data.errors.push(['A server error occurred.'])
    return data.errors
  }
}

//delete a review
export const deleteReview = (reviewId) => async(dispatch) => {
  const response = await csrfFetch(`api/reviews/${reviewId}`, {
    method: 'DELETE'
  })

  if(response.ok) {
    dispatch(destroyReview(id))
  } else if (response.status < 500) {
    const data = await response.json();
    if (data.errors) return data.errors
  }
}

const initialState = {rewviews: [], isLoading: true}

//reducer
const reviewReducer = (state = initialState, action) => {
  let newState = Object.assign({}, state)
  switch(action.type) {
    case GET_REVIEWS:
      return {...state, reviews: [...action.payload.Reviews]}
    case GET_ANIMAL_REVIEWS:
      return {...state, reviews: [...action.payload.Reviews]}
    case DELETE_REVIEW:
      delete newState[action.payload]
      delete newState.arr
      newState.arr = Object.values(newState)
      return newState
    default:
      return state;
  }
}

export default reviewReducer;