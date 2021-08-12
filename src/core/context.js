import { useState, useEffect, useContext } from 'react'
import createContext from 'mini-create-react-context'

import { isArray, isFunction, run } from '../helpers'

const context = createContext()

export default context
export const { Provider } = context

function useCacheRoute(lifecycleName, effect, deps = []) {
  if (!isFunction(useContext)) {
    return
  }

  const cacheLifecycles = useContext(context)
  useEffect(() => {
    const off = run(cacheLifecycles, 'on', lifecycleName, effect)

    return () => run(off)
  }, deps)
}
export const useDidCache = useCacheRoute.bind(null, 'didCache')
export const useDidRecover = useCacheRoute.bind(null, 'didRecover')

export const useIsInCachedRecoveredPage = () => {
  const [inCachedRecoveredPage, setInCachedRecoveredPage] = useState(false)
  useDidRecover(() => setInCachedRecoveredPage(true))

  return inCachedRecoveredPage
}

export const useIsInActivePage = () => {
  const [inActivePage, setInActivePage] = useState(true)

  useEffect(() => setInActivePage(true), [])
  useDidRecover(() => setInActivePage(true))
  useDidCache(() => setInActivePage(false))

  return inActivePage
}
