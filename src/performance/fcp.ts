// first-contentful-paint 首次内容绘制时间

import { report } from '../utils/report'
import { MonitorType, PerformanceType } from '../types'

export function getFCP() {
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.name === 'first-contentful-paint') {
        observer.disconnect()
      }
    }
  })
  observer.observe({ type: 'paint', buffered: true })
}
