import { report } from '../utils/report'
import { httpStatusMap } from '../utils'
import type { ReportData } from '../types'
import {
  BreadCrumbType,
  ErrorType,
  MonitorType,
  PerformanceType
} from '../types'
import { breadCrumb } from '../behavior/breadcrumb'
import defaultConfig from '../config'

const originalFetch = window.fetch

export function rewriteFetch() {
  window.fetch = function newFetch(url, config) {
    const startTime = Date.now()
    const reportData: ReportData = {
      startTime,
      url,
      pageUrl: window.location.href,
      method: (config?.method || 'GET').toUpperCase(),
      subType: PerformanceType.Fetch,
      type: MonitorType.Performance
    }
    let data
    return originalFetch(url, config)
      .then((res) => {
        data = res.clone()
        return res
      })
      .catch((err) => {
        reportData.status = -1
        reportData.success = false
        reportData.message = err.message
        reportData.type = MonitorType.Error
        reportData.subType = ErrorType.Fetch
        throw err
      })
      .finally(() => {
        reportData.endTime = Date.now()
        reportData.duration = reportData.endTime - reportData.startTime
        function finalReport() {
          if (!defaultConfig.url.includes(reportData.url as string)) {
            breadCrumb.push({
              type: MonitorType.Behavior,
              time: Date.now(),
              data: reportData,
              breadCrumbType: BreadCrumbType.HTTP,
              breadCrumbStatus: reportData.success ? 'success' : 'error'
            })
            report({ ...reportData, breadCrumb: breadCrumb.getStack() })
          }
        }

        if (data) {
          return data.json().then((result) => {
            const message =
              result.message ||
              result.msg ||
              httpStatusMap(result.code || result.status)
            reportData.status = result.code || result.status
            reportData.message = message
            reportData.success = message === 'OK'
            reportData.type =
              message === 'OK' ? MonitorType.Performance : MonitorType.Error
            reportData.subType =
              message === 'OK' ? PerformanceType.Fetch : ErrorType.Fetch
            finalReport()
          })
        } else {
          finalReport()
        }
      })
  }
}
