import { run } from '../helpers/try'

const __components = {}

export const register = (key, route) => {
  __components[key] = route
}

export const dropByCacheKey = key => {
  run(__components, [key, 'setState'], {
    cached: false
  })
}

export const dropCache = () => {
  Object.entries(__components)
    .filter(([, component]) => component.state.cached)
    .forEach(([key]) => run(__components, [key, 'setState'], {
      cached: false
    }))
}

export const getCachingKeys = () =>
  Object.entries(__components)
    .filter(([, component]) => component.state.cached)
    .map(([key]) => key)
