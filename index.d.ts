/// <reference types="react" />
/// <reference types="react-router" />
import * as React from 'react'
import { SwitchProps, RouteProps } from 'react-router-dom'

export interface CacheRouteProps extends RouteProps {
  className?: string
  when?: 'forward' | 'back' | 'always' | ((props: CacheRouteProps) => boolean)
  behavior?: (isCached: boolean) => object | void
  cacheKey?: string | ((props: CacheRouteProps) => string),
  unmount?: boolean
  saveScrollPosition?: boolean
  multiple?: boolean | number
}

export declare class CacheRoute extends React.Component<CacheRouteProps> {}
export default CacheRoute

export interface CacheSwitchProps extends SwitchProps {
  which?: (element: React.ElementType) => boolean
}

export declare class CacheSwitch extends React.Component<CacheSwitchProps> {}

export function dropByCacheKey(cacheKey: string): Promise
export function refreshByCacheKey(cacheKey: string): Promise
export function getCachingKeys(): Array<string>
export function clearCache(): Promise

export interface CachingComponent extends React.ComponentClass {
  __cacheCreateTime: number
  __cacheUpdateTime: number
}
export interface CachingComponentMap {
  [key: string]: CachingComponent
}
export function getCachingComponents(): CachingComponentMap
export function useDidCache(effect: () => void, deps?: any[]): void
export function useDidRecover(effect: () => void, deps?: any[]): void
