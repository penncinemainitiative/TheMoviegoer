import {
  createStore as createReduxStore,
  combineReducers,
  applyMiddleware
} from "redux"
import {token} from "../common/reducers/auth"
import {console} from "../common/reducers/console"
import thunk from "redux-thunk"
import {reducer as reduxAsyncConnect} from "redux-connect"

const reducers = combineReducers({
  reduxAsyncConnect,
  token,
  console
});

export const createStore = (initialState) => {
  return createReduxStore(reducers, initialState, applyMiddleware(thunk));
};