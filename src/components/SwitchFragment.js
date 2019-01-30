import React, { PropTypes, Fragment } from 'react'

import { isExist } from '../helpers/is'

function getFragment() {
  switch (true) {
    case isExist(PropTypes):
      console.log('v15')
      return ({ children }) => <div>{children}</div>

    case isExist(Fragment):
      console.log('v16.2+')
      return ({ children }) => <Fragment>{children}</Fragment>

    default:
      console.log('v16.2-')
      return ({ children }) => children
  }
}

const SwitchFragment = getFragment()
SwitchFragment.displayName = 'SwitchFragment'

export default SwitchFragment
