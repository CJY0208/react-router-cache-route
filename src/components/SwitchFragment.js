import React, { PropTypes, Fragment } from 'react'

import { isExist } from '../helpers'

function getFragment() {
  if (isExist(Fragment)) {
    return ({ children }) => <Fragment>{children}</Fragment>
  }

  if (isExist(PropTypes)) {
    return ({ children }) => <div>{children}</div>
  }

  return ({ children }) => children
}

const SwitchFragment = getFragment()
SwitchFragment.displayName = 'SwitchFragment'

export default SwitchFragment
