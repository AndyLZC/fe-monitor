import { report } from '../utils/report'
import {
  BreadCrumbType,
  ErrorType,
  MonitorType,
  PerformanceType
} from '../types'
import defaultConfig from '../config'
import { httpStatusMap } from '../utils'
import { breadCrumb } from '../behavior/breadcrumb'
const originalXhrProto = XMLHttpRequest.prototype
const originalXhrOpen = originalXhrProto.open
const originalXhrSend = originalXhrProto.send

export function rewriteXhr() {
  originalXhrProto.open = function (...args) {
    this.method = args[0]
    this.url = args[1]
    originalXhrOpen.apply(this, args)
  }

  originalXhrProto.send = function (...args) {
    this.startTime = Date.now()

    const onLoadend = () => {
      this.endTime = Date.now()
      this.duration = this.endTime - this.startTime
      const {
        statusText,
        response,
        duration,
        startTime,
        endTime,
        url,
        method
      } = this
      const result = JSON.parse(response)
      const status = result.code || result.status
      const message =
        result.message || result.msg || httpStatusMap(status) || statusText

      const reportData = {
        status,
        duration,
        startTime,
        endTime,
        url,
        pageUrl: window.location.href,
        method: (method || 'GET').toUpperCase(),
        message,
        success: message === 'OK',
        subType: message === 'OK' ? PerformanceType.Xhr : ErrorType.Xhr,
        type: message === 'OK' ? MonitorType.Performance : MonitorType.Error
      }
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
      this.removeEventListener('loadend', onLoadend, true)
    }

    this.addEventListener('loadend', onLoadend, true)

    originalXhrSend.apply(this, args)
  }
}
