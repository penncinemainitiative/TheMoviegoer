import {render} from "react-dom"
import {ReduxAsyncConnect, reducer as reduxAsyncConnect} from "redux-connect"
import {createStore, combineReducers} from "redux"
import React from "react"
import {Router, browserHistory} from "react-router"
import getRoutes from "../common/routes"
import {Provider} from "react-redux"

const store = createStore(combineReducers({reduxAsyncConnect}), window.__data);

render((
  <Provider store={store} key="provider">
    <Router render={(props) => <ReduxAsyncConnect {...props}/>}
            history={browserHistory}>
      {getRoutes()}
    </Router>
  </Provider>
), document.getElementById('mount'));