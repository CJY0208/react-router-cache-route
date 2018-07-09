import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { run, get } from '../helpers/try'

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

  if (
    when !== 'always' &&
    prevState.matched &&
    !nextPropsMatch &&
    ((when !== 'back' && nextProps.history.action === 'POP') ||
      (when !== 'forward' &&
        ['PUSH', 'REPLACE'].includes(nextProps.history.action)))
  ) {
    return {
      cached: false,
      matched: false
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
    when: PropTypes.oneOf(['forward', 'back', 'always'])
  }

  static defaultProps = {
    when: 'forward'
  }

  render() {
    return this.state.cached ? (
      <div
        className={this.props.className}
        style={
          this.state.matched
            ? {}
            : {
                display: 'none'
              }
        }
      >
        {run(this.props, 'children', this.cacheLifecycles)}
      </div>
    ) : null
  }

  constructor(props, ...args) {
    super(props, ...args)

    const matched = !!props.match
    this.state = {
      cached: matched,
      matched
    }
  }

  /**
   * New lifecycle for replacing the `componentWillReceiveProps` in React 16.3 +
   * React 16.3 + 版本中替代 componentWillReceiveProps 的新生命周期
   */
  static getDerivedStateFromProps = React.version.startsWith('16.3')
    ? getDerivedStateFromProps
    : undefined

  /**
   * Compatible React 16.3 -
   * 兼容 React 16.3 - 版本
   */
  componentWillReceiveProps = !React.version.startsWith('16.3')
    ? nextProps => {
        const nextState = getDerivedStateFromProps(nextProps, this.state)
        this.setState(nextState)
      }
    : undefined

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.cached || !this.state.cached) {
      return
    }

    if (prevState.matched === true && this.state.matched === false) {
      run(this, 'cacheLifecycles.__listener.didCache')
    }

    if (prevState.matched === false && this.state.matched === true) {
      run(this, 'cacheLifecycles.__listener.didRecover')
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
