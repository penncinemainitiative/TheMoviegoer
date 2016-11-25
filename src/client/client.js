import React from 'react'
import routes from '../common/routes'
import { Resolver } from 'react-resolver'

Resolver.render(() => routes, document.getElementById('mount'));