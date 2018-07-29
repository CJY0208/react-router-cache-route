import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { run, get, value } from '../helpers/try'

const __new__lifecycles =
  Number(get(run(React, 'version.match', /^\d*\.\d*/), [0])) >= 16.3

const getDerivedStateFromProps = (nextProps, prevState) => {
  let { match: nextPropsMatch, when = 'forward' } = nextProps

  /**
   * Note:
   * Turn computedMatch from CacheSwitch to a real null value if necessary
   *
   * 必要时将 CacheSwitch 计算得到的 computedMatch 值转换为真正的 null
   */
  if (get(nextPropsMatch, '__CacheRoute__computedMatch__null')) {
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
    when: PropTypes.oneOf(['forward', 'back', 'always']),
    behavior: PropTypes.func
  }

  static defaultProps = {
    when: 'forward',
    behavior: cached =>
      cached
        ? {
            style: {
              position: 'absolute',
              zIndex: -9999,
              opacity: 0,
              visibility: 'hidden',
              pointerEvents: 'none'
            }
          }
        : undefined
  }

  render() {
    const {
      className: behaviorProps__className = '',
      ...behaviorProps
    } = value(this.props.behavior(!this.state.matched), {})
    const className = `${this.props.className} ${behaviorProps__className}`

    return this.state.cached ? (
      <div className={className.trim()} {...behaviorProps}>
        {run(this.props, 'children', this.cacheLifecycles)}
      </div>
    ) : null
  }

  state = getDerivedStateFromProps(this.props, {
    cached: false,
    matched: false
  })

  /**
   * New lifecycle for replacing the `componentWillReceiveProps` in React 16.3 +
   * React 16.3 + 版本中替代 componentWillReceiveProps 的新生命周期
   */
  static getDerivedStateFromProps = __new__lifecycles
    ? getDerivedStateFromProps
    : undefined

  /**
   * Compatible React 16.3 -
   * 兼容 React 16.3 - 版本
   */
  componentWillReceiveProps = !__new__lifecycles
    ? nextProps => {
        const nextState = this.setState(
          getDerivedStateFromProps(nextProps, this.state)
        )
      }
    : undefined

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.cached || !this.state.cached) {
      return
    }

    if (prevState.matched === true && this.state.matched === false) {
      return run(this, 'cacheLifecycles.__listener.didCache')
    }

    if (prevState.matched === false && this.state.matched === true) {
      return run(this, 'cacheLifecycles.__listener.didRecover')
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.matched || nextState.matched
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
}
