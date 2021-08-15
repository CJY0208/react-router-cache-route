export default from './components/CacheRoute'
export CacheRoute, { cachedNavigation } from './components/CacheRoute'
export CacheSwitch from './components/CacheSwitch'
export {
  dropByCacheKey,
  refreshByCacheKey,
  getCachingKeys,
  clearCache,
  getCachingComponents
} from './core/manager'
export { useDidCache, useDidRecover, useIsInCachedRecoveredPage, useIsInActivePage } from './core/context'
