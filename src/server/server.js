import express from "express"
import React from "react"
import {renderToString} from "react-dom/server"
import {match, RoutingContext} from "react-router"
import {Provider} from "react-redux"
import {createStore, combineReducers} from "redux"
import getRoutes from "../common/routes"
import apiRoutes from "./api"
import {
  ReduxAsyncConnect,
  loadOnServer,
  reducer as reduxAsyncConnect
} from "redux-connect"

const app = express();

app.use('/public', express.static('public'));
app.set('view engine', 'ejs');

app.use('/api', apiRoutes);

app.use((req, res, next) => {
  const store = createStore(combineReducers({reduxAsyncConnect}));

  match({routes: getRoutes(), location: req.url},
    (error, redirectLocation, renderProps) => {
      loadOnServer({...renderProps, store}).then(() => {
        const appHTML = renderToString(
          <Provider store={store} key="provider">
            <ReduxAsyncConnect {...renderProps} />
          </Provider>
        );
        res.send(`
          <!DOCTYPE html>
          <html>
            <body>
              <div id="mount">${appHTML}</div>
              <script>window.__data = ${JSON.stringify(store.getState())}</script>
              <script src="/public/bundle.js" async defer></script>
            </body>
          </html>
        `)
      })
        .catch((error) => {
          console.log(error);
          if (error.response) {
            res.status(error.response.status).send(error.response.statusText);
          } else {
            res.status(500).send('Internal server error');
          }
        });
    })
});

app.get('*', (req, res) => {
  res.status(404).send("Not found");
});

app.listen(8000);