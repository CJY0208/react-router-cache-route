import { Component } from 'react'
import PropTypes from 'prop-types'

import { get } from '../helpers/try'
import { isExist } from '../helpers/is'

export default class Updatable extends Component {
  static propsTypes = {
    render: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired
  }

  render = () => this.props.render()

  shouldComponentUpdate(nextProps) {
    return (
      isExist(nextProps.match) &&
      get(nextProps, 'match.__CacheRoute__computedMatch__null') !== true
    )
  }
}
