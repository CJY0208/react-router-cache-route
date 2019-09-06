import { isArray } from './is'

const flatten = array =>
  array.reduce(
    (res, item) => [...res, ...(isArray(item) ? flatten(item) : [item])],
    []
  )

function getScrollableNodes(from = document) {
  const checkStyleList = ['overflow', 'overflow-x', 'overflow-y']
  const scrollableStyleValue = ['auto', 'scroll']

  return [...from.querySelectorAll('*'), from].filter(dom => {
    const styles = getComputedStyle(dom)

    return (
      (checkStyleList.some(style =>
        scrollableStyleValue.includes(styles[style])
      ) &&
        dom.scrollWidth > dom.offsetWidth) ||
      dom.scrollHeight > dom.offsetHeight
    )
  })
}

export default function saveScrollPos(from = document) {
  const nodes = flatten(
    (!isArray(from) ? [from] : from).map(getScrollableNodes)
  )
  const saver = nodes.map(node => [
    node,
    {
      x: node.scrollLeft,
      y: node.scrollTop
    }
  ])

  return function revert() {
    saver.forEach(([node, { x, y }]) => {
      node.scrollLeft = x
      node.scrollTop = y
    })
  }
}
