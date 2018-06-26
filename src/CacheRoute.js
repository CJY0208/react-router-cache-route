import React from 'react'
import { Route } from 'react-router-dom'

import CacheComponent from './CacheComponent'

export const cacheComponent = Component => props => (
  <CacheComponent {...props}>
    {cacheLifecycles => <Component {...props} {...{ cacheLifecycles }} />}
  </CacheComponent>
)

const CacheRoute = ({
  component,
  ...props
}) => (
  <Route {...props} children={cacheComponent(component)} />
)

export default CacheRoute
