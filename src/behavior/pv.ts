import { report } from '../utils/report'
import { getUUID } from '../utils'
import { BehaviorType, MonitorType } from '../types'

export function pv() {
  report({
    type: MonitorType.Behavior,
    subType: BehaviorType.pv,
    startTime: performance.now(),
    pageUrl: window.location.href,
    referrer: document.referrer,
    uuid: getUUID()
  })
}
