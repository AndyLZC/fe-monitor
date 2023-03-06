// first-screen-paint 首屏加载时间

import { report } from '../utils/report'
import { MonitorType, PerformanceType } from '../types'

interface Entry {
  startTime: number
  children: Array<Element>
}

let observer: MutationObserver
let timer: number
let entries: Array<Entry> = []

const viewPortWidth = window.innerWidth
const viewPortHeight = window.innerHeight

// 忽略变化的标签
const ignoreDOMList = ['STYLE', 'SCRIPT', 'LINK', 'META']

export function getFirstScreenPaint() {
  observer = new MutationObserver((mutationRecords) => {
    checkDomChange()
    const entry: Entry = {
      startTime: 0,
      children: []
    }
    for (const record of mutationRecords) {
      if (record.addedNodes.length) {
        for (const node of record.addedNodes) {
          const el = node as Element
          if (
            el.nodeType === 1 &&
            !ignoreDOMList.includes(el.tagName) &&
            !isIgnoreDOM(el) &&
            isInScreen(el)
          ) {
            entry.children.push(el)
          }
        }
      }
    }

    if (entry.children.length) {
      entries.push(entry)
      entry.startTime = +performance.now().toFixed(1)
    }
  })
  observer.observe(document, {
    childList: true, // 监听添加或删除子节点
    subtree: true, // 监听整个子树
    characterData: true, // 监听元素的文本是否变化
    attributes: true // 监听元素的属性是否变化
  })
}

function checkDomChange() {
  cancelAnimationFrame(timer)
  timer = requestAnimationFrame(() => {
    if (document.readyState === 'complete') {
      observer.disconnect()
      const t = getRenderTime()
      report({
        type: MonitorType.Performance,
        subType: PerformanceType.FirstScreenPaint,
        startTime: t
      })
      return (entries = null)
    }
    checkDomChange()
  })
}

function getRenderTime() {
  let startTime = 0
  entries.forEach((entry) => {
    if (entry.startTime > startTime) {
      startTime = entry.startTime
    }
  })

  performance.getEntriesByType('resource').forEach((item) => {
    if (
      item.initiatorType === 'img' &&
      item.fetchStart < startTime &&
      item.responseEnd > startTime
    ) {
      startTime = item.responseEnd
    }
  })

  return startTime
}

function isInScreen(dom: Element) {
  const { left, top } = dom.getBoundingClientRect()
  return left <= viewPortWidth && top <= viewPortHeight
}

function isIgnoreDOM(el: Element) {
  return window.getComputedStyle(el).display === 'none'
}
