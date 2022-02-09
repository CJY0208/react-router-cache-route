import { useEffect, useContext, useRef } from 'react'
import createContext from 'mini-create-react-context'

import { isArray, isFunction, run } from '../helpers'

const context = createContext()

export default context
export const { Provider, Consumer } = context

function useCacheRoute(lifecycleName, effect, deps = []) {
  if (!isFunction(useContext)) {
    return
  }

  const effectRef = useRef(() => null)
  effectRef.current = effect

  const cacheLifecycles = useContext(context)
  useEffect(() => {
    const off = run(cacheLifecycles, 'on', lifecycleName, () => {
      run(effectRef.current)
    })

    return () => run(off)
  }, [])
}
export const useDidCache = useCacheRoute.bind(null, 'didCache')
export const useDidRecover = useCacheRoute.bind(null, 'didRecover')
