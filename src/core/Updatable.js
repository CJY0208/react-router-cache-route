import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { get } from '../helpers/try'
import { isExist } from '../helpers/is'

export default class Updatable extends Component {
  static propsTypes = {
    component: PropTypes.node,
    match: PropTypes.object.isRequired
  }

  render() {
    const { component: Component, ...props } = this.props

    return <Component {...props} />
  }

  shouldComponentUpdate(nextProps) {
    return (
      isExist(nextProps.match) &&
      get(nextProps, 'match.__CacheRoute__computedMatch__null') !== true
    )
  }
}
