import { csrfFetch } from './csrf';

//action creator definitions
const GET_ANIMALS = 'animals/GET_ANIMALS';
const GET_ONE_ANIMAL = 'animals/GET_ONE_ANIMAL';


//action creator
const getAnimals = (animals) => ({
  type: GET_ANIMALS,
  payload: animals
})

const getOneAnimal = (animalDetails) => ({
  type: GET_ONE_ANIMAL,
  payload: animalDetails
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

//get one animal
export const fetchOneAnimal = (animalId) => async(dispatch) => {
  const response = await fetch(`api/animals/${animalId}`);

  if(response.ok) {
    const animalDetails = await response.json();
    dispatch(getOneAnimal(animalDetails))
  }
}

//reducer
const initialState = { animals: null };

const animalReducer = (state = initialState, action) => {
  switch(action.type) {
    case GET_ANIMALS:
      return { ...state, animals: action.payload };
    case GET_ONE_ANIMAL:
      return { ...state, animalDetails: action.payload.animalDetails}
    default:
      return state;
  }
}

export default animalReducer;