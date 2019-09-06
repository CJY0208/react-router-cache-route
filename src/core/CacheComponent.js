import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { isExist, isFunction } from '../helpers/is'
import { run, get, value } from '../helpers/try'
import saveScrollPos from '../helpers/saveScrollPos'
import { register } from './manager'

const __isUsingNewLifecycle =
  Number(get(run(React, 'version.match', /^\d*\.\d*/), [0])) >= 16.3

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

    if (props.cacheKey) {
      register(props.cacheKey, this)
    }

    if (typeof document !== 'undefined') {
      this.__placeholderNode = document.createComment(
        ` Route cached ${
          props.cacheKey ? `with cacheKey: "${props.cacheKey}" ` : ''
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
  static getDerivedStateFromProps = __isUsingNewLifecycle
    ? getDerivedStateFromProps
    : undefined

  /**
   * Compatible React 16.3 -
   * 兼容 React 16.3 - 版本
   */
  componentWillReceiveProps = !__isUsingNewLifecycle
    ? nextProps => {
        const nextState = getDerivedStateFromProps(nextProps, this.state)

        this.setState(nextState)
      }
    : undefined

  __parentNode
  __placeholderNode
  __revertScrollPos
  componentDidUpdate(prevProps, prevState) {
    if (!prevState.cached || !this.state.cached) {
      return
    }

    if (prevState.matched === true && this.state.matched === false) {
      if (this.props.unmount) {
        const parentNode = get(this.wrapper, 'parentNode')
        this.__parentNode = parentNode

        run(
          this.__parentNode,
          'insertBefore',
          this.__placeholderNode,
          this.wrapper
        )
        run(this.__parentNode, 'removeChild', this.wrapper)
      }
      return run(this, 'cacheLifecycles.__listener.didCache')
    }

    if (prevState.matched === false && this.state.matched === true) {
      if (this.props.saveScrollPosition) {
        run(this.__revertScrollPos)
      }
      return run(this, 'cacheLifecycles.__listener.didRecover')
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.unmount) {
      const willRecover =
        this.state.matched === false && nextState.matched === true

      if (willRecover) {
        run(
          this.__parentNode,
          'insertBefore',
          this.wrapper,
          this.__placeholderNode
        )
        run(this.__parentNode, 'removeChild', this.__placeholderNode)
      } else {
        if (this.props.saveScrollPosition) {
          this.__revertScrollPos = saveScrollPos(this.wrapper)
        }
      }
    }

    return (
      this.state.matched ||
      nextState.matched ||
      this.state.cached !== nextState.cached
    )
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
