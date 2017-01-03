import express from "express"
import React from "react"
import {renderToString} from "react-dom/server"
import match from "react-router/lib/match"
import {Provider} from "react-redux"
import {ReduxAsyncConnect, loadOnServer} from "redux-connect"
import Helmet from "react-helmet"
import bodyParser from "body-parser"
import helmet from "helmet"
import compression from "compression"
import cookieParser from "cookie-parser"
import getRoutes from "../common/routes"
import apiRoutes from "./api"
import {createStore} from "../common/createStore"
import {loginWithToken} from "../common/actions/auth"
import path from "path"

const app = express();

app.use(compression());
app.use(helmet());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/public', express.static('public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/api', apiRoutes);

app.use((req, res) => {
  const store = createStore();
  store.dispatch(loginWithToken(req.cookies.token));
  const routes = getRoutes(store);
  match({routes, location: req.url},
    (error, redirectLocation, renderProps) => {
      if (error) {
        res.status(500).send(error.message)
      } else if (redirectLocation) {
        res.redirect(302, redirectLocation.pathname + redirectLocation.search)
      } else if (renderProps) {
        loadOnServer({...renderProps, store}).then(() => {
          const appHTML = renderToString(
            <Provider store={store} key="provider">
              <ReduxAsyncConnect {...renderProps} />
            </Provider>
          );
          const head = Helmet.rewind();
          res.render('base', {
            appHTML,
            head,
            env: process.env.NODE_ENV,
            state: JSON.stringify(store.getState())
          })
        })
          .catch((error) => {
            console.log(error);
            if (error.response) {
              res.status(error.response.status).send(error.response.statusText);
            } else {
              res.status(500).send('Internal server error');
            }
          });
      } else {
        res.status(404).send("Not found");
      }
    });
});

app.listen(8000);