import { run } from '../helpers/try'

const __components = {}

const getCachedComponentEntries = () =>
  Object.entries(__components).filter(([, component]) => component.state.cached)

export const register = (key, component) => {
  __components[key] = component
}

export const dropByCacheKey = key =>
  run(__components, [key, 'setState'], {
    cached: false
  })

export const clearCache = () => {
  getCachedComponentEntries().forEach(([key]) => dropByCacheKey(key))
}

export const getCachingKeys = () =>
  getCachedComponentEntries().map(([key]) => key)

export const getCachingComponents = () =>
  getCachedComponentEntries().reduce((res, [key, component]) => ({
    ...res,
    [key]: component
  }), {})
