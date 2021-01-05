import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
  run,
  get,
  value,
  isExist,
  isFunction,
  saveScrollPosition,
  ObjectValues
} from '../helpers'
import * as manager from './manager'
import { Provider as CacheRouteProvider } from './context'

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
  static __name = 'CacheComponent'

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
      const cacheKey = run(props.cacheKey, undefined, props)
      if (props.multiple) {
        const { pathname } = props
        manager.register(cacheKey, {
          ...manager.getCache()[cacheKey],
          [pathname]: this
        })
      } else {
        manager.register(cacheKey, this)
      }
    }

    if (typeof document !== 'undefined') {
      const cacheKey = run(props.cacheKey, undefined, props)
      this.__placeholderNode = document.createComment(
        ` Route cached ${cacheKey ? `with cacheKey: "${cacheKey}" ` : ''}`
      )
    }

    this.state = getDerivedStateFromProps(props, {
      cached: false,
      matched: false,
      key: Math.random()
    })
  }

  cacheLifecycles = {
    __listener: {},
    __didCacheListener: {},
    __didRecoverListener: {},
    on: (eventName, func) => {
      const id = Math.random()
      const listenerKey = `__${eventName}Listener`
      this.cacheLifecycles[listenerKey][id] = func

      return () => {
        delete this.cacheLifecycles[listenerKey][id]
      }
    },
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
      ObjectValues(this.cacheLifecycles.__didCacheListener).forEach(func => {
        run(func)
      })
      return run(this, 'cacheLifecycles.__listener.didCache')
    }

    if (prevState.matched === false && this.state.matched === true) {
      if (this.props.saveScrollPosition) {
        run(this.__revertScrollPos)
      }
      this.__cacheUpdateTime = Date.now()
      ObjectValues(this.cacheLifecycles.__didRecoverListener).forEach(func => {
        run(func)
      })
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
    const { unmount, pathname, multiple } = this.props
    const cacheKey = run(this.props, 'cacheKey', this.props)

    if (multiple) {
      const cache = { ...manager.getCache()[cacheKey] }

      delete cache[pathname]

      if (Object.keys(cache).length === 0) {
        manager.remove(cacheKey)
      } else {
        manager.register(cacheKey, cache)
      }
    } else {
      manager.remove(cacheKey)
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

  refresh = () => {
    delete this.__revertScrollPos;

    this.setState({
      key: Math.random()
    });
  };

  render() {
    const { matched, cached, key } = this.state
    const { className: propsClassName = '', behavior, children } = this.props
    const { className: behaviorClassName = '', ...behaviorProps } = value(
      run(behavior, undefined, !matched),
      {}
    )
    const className = run(`${propsClassName} ${behaviorClassName}`, 'trim')
    const hasClassName = className !== ''

    return cached ? (
      <div
        key={key}
        className={hasClassName ? className : undefined}
        {...behaviorProps}
        ref={wrapper => {
          this.wrapper = wrapper
        }}
      >
        <CacheRouteProvider value={this.cacheLifecycles}>
          {run(children, undefined, this.cacheLifecycles)}
        </CacheRouteProvider>
      </div>
    ) : null
  }
}
