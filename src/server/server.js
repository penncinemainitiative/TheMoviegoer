import express from 'express'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { match, RouterContext } from 'react-router'
import routes from '../common/routes'
import indexRoutes from './routes/index'
import { Resolver } from 'react-resolver'

const app = express();

app.use('/public', express.static('public'));
app.set('view engine', 'ejs');

app.use('/article', indexRoutes);

app.use((req, res, next) => {
  match({ routes, location: req.url },
          (error, redirectLocation, renderProps) => {
    Resolver
      .resolve(() => <RouterContext {...renderProps} />)
      .then(({ Resolved, data }) => {
        res.send(`
          <!DOCTYPE html>
          <html>
            <body>
              <div id="mount">${renderToString(<Resolved />)}</div>
      
              <script>window.__REACT_RESOLVER_PAYLOAD__ = ${JSON.stringify(data)}</script>
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
      })
    ;
  })
});

app.get('*', (req, res) => {
  res.status(404).send("Not found");
});

app.listen(8000);