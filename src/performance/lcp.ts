// largest-content-paint 最大内容绘制

import { report } from '../utils/report'
import { MonitorType, PerformanceType } from '../types'

export function getLCP() {
  const observer = new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      observer.disconnect()
      report({
        type: MonitorType.Performance,
        subType: PerformanceType.LargestContentfulPaint,
        startTime: entry.startTime
      })
    }
  })

  observer.observe({
    type: 'largest-contentful-paint',
    buffered: true
  })
}
