import React, { Component } from 'react'

import { run } from './helpers/try'

export default class CacheComponent extends Component {
  render() {
    return this.state.cached ? (
      <div style={this.state.matched ? {} : {
        display: 'none'
      }}>
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

  // React 16.3+ 版本中替代 componentWillReceiveProps 的新生命周期
  static getDerivedStateFromProps = (nextProps, prevState) => {
    if (!prevState.cached && nextProps.match) {
      return {
        cached: true,
        matched: true
      }
    }

    if (
      prevState.matched &&
      nextProps.history.action === 'POP' &&
      !nextProps.match
    ) {
      return {
        cached: false,
        matched: false
      }
    }

    return {
      matched: !!nextProps.match
    }
  }

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
