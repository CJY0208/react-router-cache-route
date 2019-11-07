import React from 'react'
import PropTypes from 'prop-types'
import {
  Switch,
  matchPath,
  withRouter,
  __RouterContext
} from 'react-router-dom'

import { COMPUTED_UNMATCH_KEY, isMatch } from '../core/CacheComponent'
import Updatable from '../core/Updatable'
import SwitchFragment from './SwitchFragment'
import { get, isNull, isExist } from '../helpers'
import CacheRoute from './CacheRoute'

const isUsingNewContext = isExist(__RouterContext)

class CacheSwitch extends Switch {
  getContext = () => {
    if (isUsingNewContext) {
      const { location, match } = this.props

      return { location, match }
    } else {
      const { route } = this.context.router
      const location = this.props.location || route.location

      return {
        location,
        match: route.match
      }
    }
  }

  render() {
    const { children, which } = this.props
    const { location, match: contextMatch } = this.getContext()

    let __matchedAlready = false

    return (
      <Updatable when={isMatch(contextMatch)}>
        {() => (
          <SwitchFragment>
            {React.Children.map(children, element => {
              if (!React.isValidElement(element)) {
                return null
              }

              const path = element.props.path || element.props.from
              const match = __matchedAlready
                ? null
                : path
                ? matchPath(
                    location.pathname,
                    {
                      ...element.props,
                      path
                    },
                    contextMatch
                  )
                : contextMatch

              let child

              if (which(element)) {
                child = React.cloneElement(element, {
                  location,
                  computedMatch: match,
                  /**
                   * https://github.com/ReactTraining/react-router/blob/master/packages/react-router/modules/Route.js#L57
                   *
                   * Note:
                   * Route would use computedMatch as its next match state ONLY when computedMatch is a true value
                   * So here we have to do some trick to let the unmatch result pass Route's computedMatch check
                   *
                   * 注意：只有当 computedMatch 为真值时，Route 才会使用 computedMatch 作为其下一个匹配状态
                   * 所以这里我们必须做一些手脚，让 unmatch 结果通过 Route 的 computedMatch 检查
                   */
                  ...(isNull(match)
                    ? {
                        computedMatchForCacheRoute: {
                          [COMPUTED_UNMATCH_KEY]: true
                        }
                      }
                    : null)
                })
              } else {
                child =
                  match && !__matchedAlready
                    ? React.cloneElement(element, {
                        location,
                        computedMatch: match
                      })
                    : null
              }

              if (!__matchedAlready) {
                __matchedAlready = !!match
              }

              return child
            })}
          </SwitchFragment>
        )}
      </Updatable>
    )
  }
}

if (isUsingNewContext) {
  CacheSwitch.propTypes = {
    children: PropTypes.node,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    which: PropTypes.func
  }

  CacheSwitch = withRouter(CacheSwitch)
} else {
  CacheSwitch.contextTypes = {
    router: PropTypes.shape({
      route: PropTypes.object.isRequired
    }).isRequired
  }

  CacheSwitch.propTypes = {
    children: PropTypes.node,
    location: PropTypes.object,
    which: PropTypes.func
  }
}

CacheSwitch.defaultProps = {
  which: element => get(element, 'type') === CacheRoute
}

export default CacheSwitch
