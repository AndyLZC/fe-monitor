import { report } from '../utils/report'
import { MonitorType, PerformanceType } from '../types'

export default function getLongTask() {
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach(() => {
      // 上报长任务详情
      report({
        type: MonitorType.Performance,
        subType: PerformanceType.LongTask,
        time: Date.now()
      })
    })
  })
  observer.observe({ entryTypes: ['longtask'] })
}
