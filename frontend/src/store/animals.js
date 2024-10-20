import { csrfFetch } from './csrf';

//action creator definitions
const GET_ANIMALS = 'animals/GET_ANIMALS';
const GET_ONE_ANIMAL = 'animals/GET_ONE_ANIMAL';
const DELETE_ANIMAL = 'animals/DELETE';

//action creator
const getAnimals = (animals) => ({
  type: GET_ANIMALS,
  payload: animals
})

const getOneAnimal = (animalDetails) => ({
  type: GET_ONE_ANIMAL,
  payload: animalDetails
})

const destroyAnimal = (id) => ({
  type: DELETE_ANIMAL,
  payload: id
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

//create animal
export const createAnimal = (animalDetails) => async(dispatch) => {
  const {name, birthday, type, price, userId} = animalDetails
  const response = await csrfFetch(`api/animals/`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      userId,
      name,
      birthday,
      type,
      price
    })
  })

  if(response.ok) {
    const data = await response.json();
    dispatch(fetchAnimals())
  } else if (response.status < 500) {
    const data = await response.json();
    if (data.errors) return data.errors;
  } else {
    const data = await response.json();
    data.errors.push(['A server error occurred.'])
    return data.errors
  }
}

//update an animal
export const updateAnimal = (updatedAnimal) => async(dispatch) => {
  const { id, name, birthday, type, price } = updatedAnimal;
  const response = await csrfFetch(`api/animals/${id}`, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      name, 
      birthday,
      type,
      price
    })
  });

  if(response.ok){
    const data = response.json();
    dispatch(fetchOneAnimal(data.id))
  } else if (respoinse.status < 500) {
    const data = await response.json();
    if(data.errors) return data.errors;
  }
}

//delete animal
export const deleteAnimal = (animalId) => async(dispatch) => {
  const response = await csrfFetch(`api/animals/${animalId}`, {
    method: 'DELETE'
  })

  if(response.ok) {
    dispatch(destroyAnimal(animalId))
  } else if (response.status < 500) {
    const data = await response.json();
    if (data.errors) return data.errors
  }
}

//reducer
const initialState = { animals: null };

const animalReducer = (state = initialState, action) => {
  let newState = Object.assign({}, state)
  switch(action.type) {
    case GET_ANIMALS:
      return { ...state, animals: action.payload };
    case GET_ONE_ANIMAL:
      return { ...state, animalDetails: action.payload}
    case DELETE_ANIMAL:
      delete newState[action.payload]
      delete newState.arr
      newState.arr = Object.values(newState)
      return newState
    default:
      return state;
  }
}

export default animalReducer;