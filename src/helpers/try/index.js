import { isString, isExist, isUndefined, isFunction } from '../is'

export const get = (obj, keys = [], defaultValue) => {
  keys = isString(keys) ? keys.split('.') : keys

  let result
  let res = obj
  let idx = 0

  for (; idx < keys.length; idx++) {
    let key = keys[idx]

    if (isExist(res)) {
      res = res[key]
    } else {
      break
    }
  }

  if (idx === keys.length) {
    result = res
  }

  return isUndefined(result) ? defaultValue : result
}

export const run = (obj, keys = [], ...args) => {
  keys = isString(keys) ? keys.split('.') : keys

  const func = get(obj, keys)
  const context = get(obj, keys.slice(0, -1))

  return isFunction(func) ? func.call(context, ...args) : func
}
