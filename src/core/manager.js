import CacheComponent from './CacheComponent'
import { get, run } from '../helpers'

const __components = {}

const getCachedComponentEntries = () =>
  Object.entries(__components).filter(
    ([, cache]) =>
      cache instanceof CacheComponent
        ? cache.state.cached
        : Object.values(cache).some(cache => cache.state.cached)
  )

export const getCache = () => ({ ...__components })

export const register = (key, component) => {
  __components[key] = component
}

export const remove = key => {
  delete __components[key]
}

const dropComponent = component => run(component, 'reset')

export const dropByCacheKey = key => {
  const cache = get(__components, [key])

  if (!cache) {
    return
  }

  if (cache instanceof CacheComponent) {
    dropComponent(cache)
  } else {
    Object.values(cache).forEach(dropComponent)
  }
}

export const clearCache = () => {
  getCachedComponentEntries().forEach(([key]) => dropByCacheKey(key))
}

export const getCachingKeys = () =>
  getCachedComponentEntries().map(([key]) => key)

export const getCachingComponents = () =>
  getCachedComponentEntries().reduce(
    (res, [key, cache]) => ({
      ...res,
      ...(cache instanceof CacheComponent
        ? { [key]: cache }
        : Object.entries(cache).reduce(
            (res, [pathname, cache]) => ({
              ...res,
              [`${key}.${pathname}`]: cache
            }),
            {}
          ))
    }),
    {}
  )
