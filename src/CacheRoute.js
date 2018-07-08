import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Route } from 'react-router-dom'

import { cache } from './CacheComponent'

const isEmptyChildren = children => React.Children.count(children) === 0

export default class CacheRoute extends Component {

  static propTypes = {
    component: PropTypes.func,
    render: PropTypes.func,
    children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
    className: PropTypes.string,
    when: PropTypes.string
  }

  static defaultProps = {
    when: 'forward'
  }

  __child__wrapper__cache = new Map()

  componentWillUnmount() {
    this.__child__wrapper__cache.clear()
  }

  render() {
    let {
      children,
      render = children,
      component = render,
      className,
      when,
      ...props
    } = this.props
  
    /**
     * Note:
     * If children prop is a React Element, define the corresponding wrapper component and cache the definition of the wrapper component with Map
     * (If the definition of the wrapper component is not cached, it will be redefined and re-rendered, causing in a failed component cache)
     * 
     * 说明：如果 children 属性是 React Element 则定义对应的包裹组件，并使用 Map 缓存包裹组件的定义（若不缓存包裹组件的定义会造成其重新定义、渲染，导致组件的缓存失效）
     */
    if (React.isValidElement(children) || !isEmptyChildren(children)) {

      if (this.__child__wrapper__cache.has(children)) {
        component = this.__child__wrapper__cache.get(children)
      } else {
        component = () => children

        this.__child__wrapper__cache.set(children, component)
      }    
    }

    return (
      /**
       * Only children prop of Route can help to control rendering behavior
       * 只有 Router 的 children 属性有助于主动控制渲染行为
       */
      <Route {...props} children={cache(component, {
        className, when
      })} />
    )
  }
}
