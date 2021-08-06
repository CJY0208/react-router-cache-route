import { isArray } from './base/is'
import * as uuid from 'uuid/v4'

export const nextTick = func => Promise.resolve().then(func)

export const flatten = array =>
  array.reduce(
    (res, item) => [...res, ...(isArray(item) ? flatten(item) : [item])],
    []
  )

/**
 * [钳子] 用来将数字限制在给定范围内
 * @param {Number} value 被限制值
 * @param {Number} min 最小值
 * @param {Number} max 最大值
 */
export const clamp = (value, min, max = Number.MAX_VALUE) => {
  if (value < min) {
    return min
  }

  if (value > max) {
    return max
  }

  return value
}

export const ObjectValues = (object) => {
  const res = []
  for (let key in object) {
    res.push(object[key])
  }
  return res
}

/*
 * For cached routes, we want to mount a new page every time we transition.
 * We create a cacheBust and pass it into the route's state. Our CacheRoute component then uses the cacheBust identifier
 * To know whether to fetch an already cached component or a brand new one
 */
export const generateCacheBust  = () => {
  return uuid().slice(0, 8)
}
