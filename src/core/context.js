import { useState, useContext } from 'react'
import createContext from 'mini-create-react-context'

import { isFunction, run } from '../helpers'

const context = createContext()

export default context
export const { Provider, Consumer } = context

function useCacheRoute(lifecycleName, effect) {
  if (!isFunction(useContext)) {
    return
  }

  const cacheLifecycles = useContext(context)
  useState(() => {
    run(cacheLifecycles, lifecycleName, effect)
  })
}
export const useDidCache = useCacheRoute.bind(null, 'didCache')
export const useDidRecover = useCacheRoute.bind(null, 'didRecover')
