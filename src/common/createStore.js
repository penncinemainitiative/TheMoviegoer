import {
  createStore as createReduxStore,
  combineReducers,
  applyMiddleware
} from "redux"
import {token} from "../common/reducers/auth"
import {console} from "../common/reducers/console"
import {recentArticles} from "../common/reducers/articles"
import {about} from "../common/reducers/about"
import thunk from "redux-thunk"
import {reducer as reduxAsyncConnect} from "redux-connect"

const reducers = combineReducers({
  reduxAsyncConnect,
  token,
  console,
  recentArticles,
  about
});

export const createStore = (initialState) => {
  return createReduxStore(reducers, initialState, applyMiddleware(thunk));
};