import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import sessionReducer from './session';
import animalReducer from './animals';
import imageReducer from './images';
import reviewReducer from './reviews';
import reservationReducer from './reservations';

const rootReducer = combineReducers({
  session: sessionReducer,
  animals: animalReducer,
  images: imageReducer,
  reviews: reviewReducer,
  reservations: reservationReducer
});

let enhancer;
if (import.meta.env.MODE === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = (await import("redux-logger")).default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
