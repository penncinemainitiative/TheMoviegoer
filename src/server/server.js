import express from 'express'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { match, RouterContext } from 'react-router'
import routes from '../common/routes'

const app = express();

app.use('/public', express.static('public'))
app.set('view engine', 'ejs')

app.use((req, res, next) => {
  match({ routes, location: req.url },
          (error, redirectLocation, renderProps) => {
    if (error) {
      res.status(500).send(error.message)
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search)
    } else if (renderProps) {
      res.render('base.ejs', {
        reactHtml: renderToString(<RouterContext {...renderProps} />)
      })
    } else {
      res.status(404).send('Not found')
    }
  })
})

app.listen(8000)
