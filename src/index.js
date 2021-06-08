export default from './components/CacheRoute'
export CacheRoute from './components/CacheRoute'
export CacheSwitch from './components/CacheSwitch'
export { get } from './helpers'
export {
  dropByCacheKey,
  refreshByCacheKey,
  getCachingKeys,
  clearCache,
  getCachingComponents
} from './core/manager'
export { useDidCache, useDidRecover } from './core/context'
