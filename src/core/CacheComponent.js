import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
  run,
  get,
  value,
  isExist,
  isFunction,
  saveScrollPosition
} from '../helpers'
import * as manager from './manager'

const isUsingNewLifecycle = isExist(React.forwardRef)

export const COMPUTED_UNMATCH_KEY = '__isComputedUnmatch'
export const isMatch = match =>
  isExist(match) && get(match, COMPUTED_UNMATCH_KEY) !== true

const getDerivedStateFromProps = (nextProps, prevState) => {
  let { match: nextPropsMatch, when = 'forward' } = nextProps

  /**
   * Note:
   * Turn computedMatch from CacheSwitch to a real null value
   *
   * 将 CacheSwitch 计算得到的 computedMatch 值转换为真正的 null
   */
  if (!isMatch(nextPropsMatch)) {
    nextPropsMatch = null
  }

  if (!prevState.cached && nextPropsMatch) {
    return {
      cached: true,
      matched: true
    }
  }

  /**
   * Determines whether it needs to cancel the cache based on the next unmatched props action
   *
   * 根据下个未匹配状态动作决定是否需要取消缓存
   */
  if (prevState.matched && !nextPropsMatch) {
    const nextAction = get(nextProps, 'history.action')

    let __cancel__cache = false

    if (isFunction(when)) {
      __cancel__cache = !when(nextProps)
    } else {
      switch (when) {
        case 'always':
          break
        case 'back':
          if (['PUSH', 'REPLACE'].includes(nextAction)) {
            __cancel__cache = true
          }

          break
        case 'forward':
        default:
          if (nextAction === 'POP') {
            __cancel__cache = true
          }
      }
    }

    if (__cancel__cache) {
      return {
        cached: false,
        matched: false
      }
    }
  }

  return {
    matched: !!nextPropsMatch
  }
}

export default class CacheComponent extends Component {
  static propsTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    children: PropTypes.func.isRequired,
    className: PropTypes.string,
    when: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.oneOf(['forward', 'back', 'always'])
    ]),
    behavior: PropTypes.func,
    unmount: PropTypes.bool,
    saveScrollPosition: PropTypes.bool
  }

  static defaultProps = {
    when: 'forward',
    unmount: false,
    saveScrollPosition: false,
    behavior: cached =>
      cached
        ? {
            style: {
              display: 'none'
            }
          }
        : undefined
  }

  constructor(props, ...args) {
    super(props, ...args)

    this.__cacheCreateTime = Date.now()
    this.__cacheUpdateTime = this.__cacheCreateTime
    if (props.cacheKey) {
      if (get(props.cacheKey, 'multiple')) {
        const { cacheKey, pathname } = props.cacheKey
        manager.register(cacheKey, {
          ...manager.getCache()[cacheKey],
          [pathname]: this
        })
      } else {
        manager.register(props.cacheKey, this)
      }
    }

    if (typeof document !== 'undefined') {
      this.__placeholderNode = document.createComment(
        ` Route cached ${
          props.cacheKey
            ? `with cacheKey: "${get(
                props.cacheKey,
                'cacheKey',
                props.cacheKey
              )}" `
            : ''
        }`
      )
    }

    this.state = getDerivedStateFromProps(props, {
      cached: false,
      matched: false
    })
  }

  cacheLifecycles = {
    __listener: {},
    didCache: listener => {
      this.cacheLifecycles.__listener['didCache'] = listener
    },
    didRecover: listener => {
      this.cacheLifecycles.__listener['didRecover'] = listener
    }
  }

  /**
   * New lifecycle for replacing the `componentWillReceiveProps` in React 16.3 +
   * React 16.3 + 版本中替代 componentWillReceiveProps 的新生命周期
   */
  static getDerivedStateFromProps = isUsingNewLifecycle
    ? getDerivedStateFromProps
    : undefined

  /**
   * Compatible React 16.3 -
   * 兼容 React 16.3 - 版本
   */
  componentWillReceiveProps = !isUsingNewLifecycle
    ? nextProps => {
        const nextState = getDerivedStateFromProps(nextProps, this.state)

        this.setState(nextState)
      }
    : undefined

  __parentNode
  __placeholderNode
  __revertScrollPos
  injectDOM = () => {
    try {
      run(
        this.__parentNode,
        'insertBefore',
        this.wrapper,
        this.__placeholderNode
      )
      run(this.__parentNode, 'removeChild', this.__placeholderNode)
    } catch (err) {
      // nothing
    }
  }

  ejectDOM = () => {
    try {
      const parentNode = get(this.wrapper, 'parentNode')
      this.__parentNode = parentNode

      run(
        this.__parentNode,
        'insertBefore',
        this.__placeholderNode,
        this.wrapper
      )
      run(this.__parentNode, 'removeChild', this.wrapper)
    } catch (err) {
      // nothing
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (!prevState.cached || !this.state.cached) {
      return
    }

    if (prevState.matched === true && this.state.matched === false) {
      if (this.props.unmount) {
        this.ejectDOM()
      }
      this.__cacheUpdateTime = Date.now()
      return run(this, 'cacheLifecycles.__listener.didCache')
    }

    if (prevState.matched === false && this.state.matched === true) {
      if (this.props.saveScrollPosition) {
        run(this.__revertScrollPos)
      }
      this.__cacheUpdateTime = Date.now()
      return run(this, 'cacheLifecycles.__listener.didRecover')
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const willRecover =
      this.state.matched === false && nextState.matched === true
    const willDrop = this.state.cached === true && nextState.cached === false
    const shouldUpdate =
      this.state.matched ||
      nextState.matched ||
      this.state.cached !== nextState.cached

    if (shouldUpdate) {
      if ((this.props.unmount && willDrop) || willRecover) {
        this.injectDOM()
      }

      if (!(willDrop || willRecover) && this.props.saveScrollPosition) {
        this.__revertScrollPos = saveScrollPosition(
          this.props.unmount ? this.wrapper : undefined
        )
      }
    }

    return shouldUpdate
  }

  componentWillUnmount() {
    const { cacheKey: cacheKeyConfig, unmount } = this.props

    if (get(cacheKeyConfig, 'multiple')) {
      const { cacheKey, pathname } = cacheKeyConfig
      const cache = { ...manager.getCache()[cacheKey] }

      delete cache[pathname]

      if (Object.keys(cache).length === 0) {
        manager.remove(cacheKey)
      } else {
        manager.register(cacheKey, cache)
      }
    } else {
      manager.remove(cacheKeyConfig)
    }

    if (unmount) {
      this.injectDOM()
    }
  }

  reset = () => {
    delete this.__revertScrollPos

    this.setState({
      cached: false
    })
  }

  render() {
    const { matched, cached } = this.state
    const { className: propsClassName = '', behavior, children } = this.props
    const { className: behaviorClassName = '', ...behaviorProps } = value(
      run(behavior, undefined, !matched),
      {}
    )
    const className = run(`${propsClassName} ${behaviorClassName}`, 'trim')
    const hasClassName = className !== ''

    return cached ? (
      <div
        className={hasClassName ? className : undefined}
        {...behaviorProps}
        ref={wrapper => {
          this.wrapper = wrapper
        }}
      >
        {run(children, undefined, this.cacheLifecycles)}
      </div>
    ) : null
  }
}
