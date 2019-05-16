import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Route } from 'react-router-dom'

import CacheComponent from '../core/CacheComponent'
import Updatable from '../core/Updatable'
import { run } from '../helpers/try'

const isEmptyChildren = children => React.Children.count(children) === 0

export default class CacheRoute extends Component {
  static componentName = 'CacheRoute'

  static propTypes = {
    component: PropTypes.elementType || PropTypes.any,
    render: PropTypes.func,
    children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
    className: PropTypes.string,
    when: PropTypes.oneOf(['forward', 'back', 'always']),
    behavior: PropTypes.func
  }

  static defaultProps = {
    when: 'forward'
  }

  render() {
    let {
      children,
      render,
      component,
      className,
      when,
      behavior,
      cacheKey,
      ...__rest__props
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

    return (
      /**
       * Only children prop of Route can help to control rendering behavior
       * 只有 Router 的 children 属性有助于主动控制渲染行为
       */
      <Route
        {...__rest__props}
        children={props => (
          <CacheComponent
            {...props}
            {...{ when, className, behavior, cacheKey }}
          >
            {cacheLifecycles => (
              <Updatable
                match={props.match}
                render={() => {
                  Object.assign(props, { cacheLifecycles })

                  if (component) {
                    return React.createElement(component, props)
                  }

                  return run(render || children, undefined, props)
                }}
              />
            )}
          </CacheComponent>
        )}
      />
    )
  }
}
