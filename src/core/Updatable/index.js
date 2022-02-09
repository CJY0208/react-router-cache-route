import React, { Component, Suspense } from 'react'
import ReactFreeze from './Freeze'
import PropTypes from 'prop-types'

import { run, get } from '../../helpers'

const isSusSupported = !!Suspense
const Freeze = isSusSupported ? ReactFreeze : ({ children }) => children

export default class Updatable extends Component {
  static propsTypes = {
    when: PropTypes.bool.isRequired
  }
  state = {
    freeze: false
  }
  constructor(props) {
    super(props)
    this.state = {
      freeze: !props.when
    }
  }

  freezeTimeout = null
  shouldComponentUpdate = ({ when }) => {
    const currentWhen = this.props.when

    if (when !== currentWhen) {
      clearTimeout(this.freezeTimeout)
      this.freezeTimeout = setTimeout(() => {
        this.setState({
          freeze: !when
        })
      }, 1000)
    }
    return when
  }
  render = () => (
    <Freeze freeze={this.state.freeze}>
      {run(this.props, 'children')}
    </Freeze>
  )
}
