import React, { Component, Suspense } from 'react'
import ReactFreeze from './Freeze'
import PropTypes from 'prop-types'

import { run, get } from '../../helpers'

const isSusSupported = !!Suspense
const Freeze = isSusSupported ? ReactFreeze : ({ children }) => children

class DelayFreeze extends Component {
  static propsTypes = {
    freeze: PropTypes.bool.isRequired
  }
  state = {
    freeze: false,
  }
  constructor(props) {
    super(props)
    this.state = {
      freeze: props.freeze,
    }
  }

  freezeTimeout = null
  shouldComponentUpdate = ({ freeze }) => {
    const currentFreeze = this.props.freeze

    if (freeze !== currentFreeze) {
      clearTimeout(this.freezeTimeout)
      this.freezeTimeout = setTimeout(() => {
        this.setState({
          freeze,
        })
      }, 1000)
    }

    return true
  }
  render = () => (
    <Freeze freeze={!this.props.freeze ? false : this.state.freeze}>
      {run(this.props, 'children')}
    </Freeze>
  )
}

class Updatable extends Component {
  static propsTypes = {
    when: PropTypes.bool.isRequired,
  }

  render = () => run(this.props, 'children')
  shouldComponentUpdate = ({ when }) => when
}

export default ({ autoFreeze = true, ...props }) => (
  <DelayFreeze freeze={autoFreeze && !props.when}>
    <Updatable {...props} />
  </DelayFreeze>
)
