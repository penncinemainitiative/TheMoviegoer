import express from "express"
import React from "react"
import {renderToString} from "react-dom/server"
import {match, RoutingContext} from "react-router"
import {Provider} from "react-redux"
import {createStore, combineReducers} from "redux"
import getRoutes from "../common/routes"
import apiRoutes from "./api"
import Helmet from "react-helmet"
import bodyParser from 'body-parser'
import helmet from 'helmet'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import {
  ReduxAsyncConnect,
  loadOnServer,
  reducer as reduxAsyncConnect
} from "redux-connect"

const app = express();

app.use(compression());
app.use(helmet());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

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
        const head = Helmet.rewind();
        res.send(`
          <!DOCTYPE html>
          <html ${head.htmlAttributes.toString()}>
            <head>
                ${head.title.toString()}
                ${head.meta.toString()}
                ${head.link.toString()}
            <link rel="stylesheet"
                  href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css"/>
            <link rel="stylesheet"
                  href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap-theme.min.css"/>
            </head>
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