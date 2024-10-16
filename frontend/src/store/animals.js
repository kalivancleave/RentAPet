import { csrfFetch } from './csrf';

//action creator definitions
const GET_ANIMALS = 'animals/GET_ANIMALS';


//action creator
const getAnimals = (animals) => ({
  type: GET_ANIMALS,
  payload: animals
})

//thunks
//get all animals
export const fetchAnimals = () => async(dispatch) => {
  const response = await fetch(`/api/animals`);

  if(response.ok) {
    const animals = await response.json();
    dispatch(getAnimals(animals));
    return animals.Animals
  } else if (response.status < 500) {
    const data = await response.json();
    if (data.errors) return data.errors;
  } else {
    const data = await response.json();
    data.error.push(['A server error occurred.'])
    return data.errors;
  }
}

//reducer
const initialState = { animals: null };

const animalReducer = (state = initialState, action) => {
  switch(action.type) {
    case GET_ANIMALS:
      return { ...state, animals: action.payload };
    default:
      return state;
  }
}

export default animalReducer;