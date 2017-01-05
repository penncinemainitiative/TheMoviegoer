import {
  createStore as createReduxStore,
  combineReducers,
  applyMiddleware
} from "redux"
import {token} from "../common/reducers/auth"
import thunk from "redux-thunk"
import {reducer as reduxAsyncConnect} from "redux-connect"

const reducers = combineReducers({
  reduxAsyncConnect,
  token
});

export const createStore = (initialState) => {
  return createReduxStore(reducers, initialState, applyMiddleware(thunk));
};