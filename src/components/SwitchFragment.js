import React, { PropTypes, Fragment } from 'react'

import { isExist } from '../helpers/is'

function getFragment() {
  switch (true) {
    case isExist(PropTypes):
      return ({ children }) => <div>{children}</div>

    case isExist(Fragment):
      return ({ children }) => <Fragment>{children}</Fragment>

    default:
      return ({ children }) => children
  }
}

const SwitchFragment = getFragment()
SwitchFragment.displayName = 'SwitchFragment'

export default SwitchFragment
