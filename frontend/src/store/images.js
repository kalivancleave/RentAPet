import { csrfFetch } from "./csrf";

//action creator definitions
const GET_IMAGES = 'images/GET_IMAGES'

//action creator
const getImages = (images) => ({
  type: GET_IMAGES,
  payload: images
})

//thunks
//get all images
export const fetchImages = (animalId) => async (dispatch) => {
  const response = await fetch(`api/animals/${animalId}`);

  if(response.ok) {
    const images = await response.json();
    dispatch(getImages(images));
  }
}

//create image
export const createImage = (newImage) => async (dispatch) => {
  const {animalId, url} = newImage
  const result = await csrfFetch(`/api/animals/${animalId}/images`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      animalId,
      url
    })
  })

  if(result.ok) {
    const data = await result.json();
    dispatch(getImages(data.id))
  } else if (result.status < 500) {
    const data = await result.json();
    if (data.errors) return data.errors;
  }
}

const initialState = { images: [], isLoading: true}

//reducer
const imageReducer = (state = initialState, action) => {
  switch(action.type) {
    case GET_IMAGES:
      return {...state, images: [action.payload]}
    default:
      return state;
  }
}

export default imageReducer;