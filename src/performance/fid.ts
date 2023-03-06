// first-input-delay 首次输入延迟

import { report } from '../utils/report'
import { MonitorType, PerformanceType } from '../types'

export function getFID() {
  const observer = new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      const e = entry as PerformanceEventTiming
      observer.disconnect()
      report({
        type: MonitorType.Performance,
        subType: PerformanceType.FirstInputDelay,
        startTime: +(e.processingStart - e.startTime).toFixed(1)
      })
    }
  })
  observer.observe({ type: 'first-input', buffered: true })
}
