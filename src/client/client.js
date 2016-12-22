import {render} from "react-dom"
import {ReduxAsyncConnect} from "redux-connect"
import React from "react"
import Router from "react-router/lib/Router"
import browserHistory from "react-router/lib/browserHistory"
import getRoutes from "../common/routes"
import {Provider} from "react-redux"
import {createStore} from "../common/createStore"

const store = createStore(window.__data);

render((
  <Provider store={store} key="provider">
    <Router render={(props) => <ReduxAsyncConnect {...props}/>}
            history={browserHistory}>
      {getRoutes(store)}
    </Router>
  </Provider>
), document.getElementById('mount'));