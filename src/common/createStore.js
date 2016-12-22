import {createStore as createReduxStore, combineReducers} from "redux"
import {auth as authToken} from "../common/reducers/auth"
import {reducer as reduxAsyncConnect} from "redux-connect"

const reducers = combineReducers({
  reduxAsyncConnect,
  authToken
});

export const createStore = (initialState) => {
  if (initialState) {
    return createReduxStore(reducers, initialState);
  } else {
    return createReduxStore(reducers);
  }
};