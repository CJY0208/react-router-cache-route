import React from 'react'

import CacheComponent from './CacheComponent'
import Updatable from './Updatable'

const cache = (component, config) => props => (
  <CacheComponent {...props} {...config}>
    {cacheLifecycles => (
      <Updatable {...props} {...{ cacheLifecycles, component }} />
    )}
  </CacheComponent>
)

export default cache
