import { report } from '../utils/report'
import { BehaviorType, BreadCrumbType, MonitorType } from '../types'
import { createHistoryEvent } from '../utils/pv'
import defaultConfig from '../config'
import { breadCrumb } from './breadcrumb'

export function pageChange() {
  window.history.pushState = createHistoryEvent('pushState')
  window.history.replaceState = createHistoryEvent('replaceState')

  if (defaultConfig.historyTracker) {
    let from = window.location.href
    let fromPathName = window.location.pathname
    window.addEventListener('pushState', () => {
      const to = window.location.href
      const toPathname = window.location.pathname
      breadCrumb.push({
        type: MonitorType.Behavior,
        time: Date.now(),
        data: [fromPathName, toPathname],
        breadCrumbType: BreadCrumbType.ROUTE,
        breadCrumbStatus: 'info'
      })
      setTimeout(() => {
        report({
          from,
          to,
          type: MonitorType.Behavior,
          subType: BehaviorType.pushState,
          breadCrumb: breadCrumb.getStack()
        })
        from = to
        fromPathName = toPathname
      }, 100)
    })
  }

  if (defaultConfig.hashTracker) {
    let oldUrl = ''
    window.addEventListener('hashchange', (e: HashChangeEvent) => {
      const newUrl = e.newURL
      breadCrumb.push({
        type: MonitorType.Behavior,
        time: Date.now(),
        data: [oldUrl, newUrl],
        breadCrumbType: BreadCrumbType.Click,
        breadCrumbStatus: 'info'
      })
      setTimeout(() => {
        report({
          from: oldUrl,
          to: newUrl,
          type: MonitorType.Behavior,
          subType: BehaviorType.hashChange,
          breadCrumb: breadCrumb.getStack()
        })
      }, 100)
      oldUrl = newUrl
    })
  }
}
