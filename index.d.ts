/// <reference types="react" />
/// <reference types="react-router" />
import * as React from 'react'
import { Switch, SwitchProps, RouteProps } from 'react-router-dom'

export enum When {
  FORWARD = 'forward',
  BACK = 'back',
  ALWAYS = 'always'
}

export interface CacheRouteProps extends RouteProps {
  className?: string
  when?: When | ((props: CacheRouteProps) => boolean)
  behavior?: (cached) => object | void
  cacheKey?: string
  unmount?: boolean
  saveScrollPosition?: boolean
  multiple?: boolean | number
}

export declare class CacheRoute extends React.Component<CacheRouteProps> {}
export default CacheRoute

export interface CacheSwitchProps extends SwitchProps {
  which?: (element: React.ElementType) => boolean
}

export declare class CacheSwitch extends Switch<CacheSwitchProps> {}

export function dropByCacheKey(cacheKey: string): void
export function getCachingKeys(): Array<string>
export function clearCache(): void

export interface CachingComponent extends React.ComponentClass {
  __cacheCreateTime: number
  __cacheUpdateTime: number
}
export interface CachingComponentMap {
  [key: string]: CachingComponent
}
export function getCachingComponents(): CachingComponentMap
