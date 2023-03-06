import { report } from '../utils/report'
import { getUUID } from '../utils'
import { BehaviorType, MonitorType } from '../types'

export function accessDuration() {
  window.addEventListener('beforeunload', () => {
    report(
      {
        type: MonitorType.Behavior,
        subType: BehaviorType.accessDuration,
        startTime: performance.now(),
        pageURL: window.location.href,
        uuid: getUUID()
      },
      true
    )
  })
}
