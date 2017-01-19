import {render} from "react-dom"
import {ReduxAsyncConnect} from "redux-connect"
import React from "react"
import Router from "react-router/lib/Router"
import applyRouterMiddleware from "react-router/lib/applyRouterMiddleware"
import getRoutes from "../common/routes/routes"
import {Provider} from "react-redux"
import {createStore} from "../common/createStore"
import useScroll from "react-router-scroll/lib/useScroll"
import createBrowserHistory from 'history/lib/createBrowserHistory'

const store = createStore(window.__data);
const history = createBrowserHistory();

history.listen((location) => {
  if (process.env.NODE_ENV === 'production') {
    window.ga('send', 'pageview', location.pathname);
  }
});

render((
  <Provider store={store} key="provider">
    <Router render={(props) =>
      <ReduxAsyncConnect {...props}
                         render={applyRouterMiddleware(useScroll())}/>}
            history={history}>
      {getRoutes(store)}
    </Router>
  </Provider>
), document.getElementById('mount'));