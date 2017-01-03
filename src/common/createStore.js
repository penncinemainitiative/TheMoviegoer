import {createStore as createReduxStore, combineReducers} from "redux"
import {token} from "../common/reducers/auth"
import {reducer as reduxAsyncConnect} from "redux-connect"

const reducers = combineReducers({
  reduxAsyncConnect,
  token
});

export const createStore = (initialState) => {
  if (initialState) {
    return createReduxStore(reducers, initialState);
  } else {
    return createReduxStore(reducers);
  }
};