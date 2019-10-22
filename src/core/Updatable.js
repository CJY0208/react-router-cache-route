import { Component } from 'react'
import PropTypes from 'prop-types'

import { run, get } from '../helpers'

export default class Updatable extends Component {
  static propsTypes = {
    when: PropTypes.bool.isRequired
  }

  render = () => run(this.props, 'children')
  shouldComponentUpdate = ({ when }) => when
}
