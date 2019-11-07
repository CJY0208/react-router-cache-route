import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Route } from 'react-router-dom'

import CacheComponent, { isMatch } from '../core/CacheComponent'
import Updatable from '../core/Updatable'
import { run, isExist, isNumber, clamp } from '../helpers'

const isEmptyChildren = children => React.Children.count(children) === 0
const isFragmentable = isExist(Fragment)

export default class CacheRoute extends Component {
  static componentName = 'CacheRoute'

  static propTypes = {
    component: PropTypes.elementType || PropTypes.any,
    render: PropTypes.func,
    children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
    computedMatchForCacheRoute: PropTypes.object,
    multiple: PropTypes.oneOfType([PropTypes.bool, PropTypes.number])
  }

  static defaultProps = {
    multiple: false
  }

  cache = {}

  render() {
    let {
      children,
      render,
      component,
      className,
      when,
      behavior,
      cacheKey,
      unmount,
      saveScrollPosition,
      computedMatchForCacheRoute,
      multiple,
      ...restProps
    } = this.props

    /**
     * Note:
     * If children prop is a React Element, define the corresponding wrapper component for supporting multiple children
     *
     * 说明：如果 children 属性是 React Element 则定义对应的包裹组件以支持多个子组件
     */
    if (React.isValidElement(children) || !isEmptyChildren(children)) {
      render = () => children
    }

    if (computedMatchForCacheRoute) {
      restProps.computedMatch = computedMatchForCacheRoute
    }

    if (multiple && !isFragmentable) {
      multiple = false
    }

    if (isNumber(multiple)) {
      multiple = clamp(multiple, 1)
    }

    return (
      /**
       * Only children prop of Route can help to control rendering behavior
       * 只有 Router 的 children 属性有助于主动控制渲染行为
       */
      <Route {...restProps}>
        {props => {
          const { match, computedMatch, location } = props
          const isMatchCurrentRoute = isMatch(props.match)
          const { pathname: currentPathname } = location
          const maxMultipleCount = isNumber(multiple) ? multiple : Infinity
          const configProps = {
            when,
            className,
            behavior,
            cacheKey,
            unmount,
            saveScrollPosition
          }

          const renderSingle = props => (
            <CacheComponent {...props}>
              {cacheLifecycles => (
                <Updatable when={isMatch(props.match)}>
                  {() => {
                    Object.assign(props, { cacheLifecycles })

                    if (component) {
                      return React.createElement(component, props)
                    }

                    return run(render || children, undefined, props)
                  }}
                </Updatable>
              )}
            </CacheComponent>
          )

          if (multiple && isMatchCurrentRoute) {
            this.cache[currentPathname] = {
              updateTime: Date.now(),
              render: renderSingle
            }

            Object.entries(this.cache)
              .sort(([, prev], [, next]) => next.updateTime - prev.updateTime)
              .forEach(([pathname], idx) => {
                if (idx >= maxMultipleCount) {
                  delete this.cache[pathname]
                }
              })
          }

          return multiple ? (
            <Fragment>
              {Object.entries(this.cache).map(([pathname, { render }]) => {
                const recomputedMatch =
                  pathname === currentPathname ? match || computedMatch : null

                return (
                  <Fragment key={pathname}>
                    {render({
                      ...props,
                      ...configProps,
                      cacheKey: cacheKey
                        ? {
                            cacheKey,
                            pathname,
                            multiple: true
                          }
                        : undefined,
                      key: pathname,
                      match: recomputedMatch
                    })}
                  </Fragment>
                )
              })}
            </Fragment>
          ) : (
            renderSingle({ ...props, ...configProps })
          )
        }}
      </Route>
    )
  }
}
