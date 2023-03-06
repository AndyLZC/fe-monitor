// cumulative-layout-shift 累积布局偏移值

import { report } from '../utils/report'
import { MonitorType, PerformanceType } from '../types'

export function getCLS() {
  let observer: MutationObserver
  let clsValue = 0
  let sessionValue = 0
  let sessionEntries = []

  const entryHandler = (entryList) => {
    for (const entry of entryList.getEntries()) {
      if (!entry.hadRecentInput) {
        const firstSessionEntry = sessionEntries[0]
        const lastSessionEntry = sessionEntries[sessionEntries.length - 1]

        if (
          sessionValue &&
          entry.startTime - lastSessionEntry.startTime < 1000 &&
          entry.startTime - firstSessionEntry.startTime < 5000
        ) {
          sessionValue += entry.value
          sessionEntries.push(entry)
        } else {
          sessionValue = entry.value
          sessionEntries = [entry]
        }

        if (sessionValue > clsValue) {
          clsValue = sessionValue
          observer.disconnect()
          report({
            type: MonitorType.Performance,
            subType: PerformanceType.CumlativeLayoutShift,
            startTime: performance.now(),
            value: sessionValue
          })
        }
      }
    }
  }

  observer = new PerformanceObserver(entryHandler)
  observer.observe({ type: 'layout-shift', buffered: true })
}
