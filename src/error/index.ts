import ErrorStackParser from 'error-stack-parser'
import { report } from '../utils/report'
import { BreadCrumbType, ErrorType, MonitorType } from '../types'
import { interceptStr } from '../utils/index'
import { breadCrumb } from '../behavior/breadcrumb'

// 捕捉 js 错误
export function vueErrorHandler(e: any) {
  try {
    const target = e.target
    if (!target || (e.target && !e.target.localName)) {
      const stackFrame = ErrorStackParser.parse(!target ? e : e.error)[0]
      const { fileName, columnNumber, lineNumber } = stackFrame

      setTimeout(() => {
        breadCrumb.push({
          type: MonitorType.Error,
          time: Date.now(),
          data: e.message,
          breadCrumbType: BreadCrumbType.CODEERROR,
          breadCrumbStatus: 'error'
        })
        report({
          type: MonitorType.Error,
          subType: ErrorType.Js,
          startTime: Date.now(),
          pageUrl: window.location.href,
          message: e.message,
          fileName,
          lineNumber,
          columnNumber,
          breadCrumb: breadCrumb.getStack()
        })
      })
    }
  } catch (error) {
    console.log(error)
  }
}

export function error() {
  //  捕捉请求资源错误
  window.addEventListener(
    'error',
    (e: any) => {
      const target = e.target
      if (!target) {
        return
      }
      if (target.src || target.href) {
        const url = target.src || target.href
        setTimeout(() => {
          breadCrumb.push({
            type: MonitorType.Error,
            time: Date.now(),
            data: url,
            breadCrumbType: BreadCrumbType.RESOURCE,
            breadCrumbStatus: 'error'
          })
          return report({
            type: MonitorType.Error,
            subType: ErrorType.Resource,
            startTime: Date.now(),
            message: target.outerHTML,
            resourceType: target.tagName,
            url,
            pageUrl: window.location.href,
            breadCrumb: breadCrumb.getStack()
          })
        })
      }
    },
    true
  )

  // 捕捉 promise 错误
  window.addEventListener('unhandledrejection', (e) => {
    const { fileName, columnNumber, lineNumber } = ErrorStackParser.parse(
      e.reason
    )[0]
    setTimeout(() => {
      breadCrumb.push({
        type: MonitorType.Error,
        time: Date.now(),
        data: interceptStr(e.reason.message, 130),
        breadCrumbType: BreadCrumbType.CODEERROR,
        breadCrumbStatus: 'error'
      })
      report({
        type: MonitorType.Error,
        subType: ErrorType.Promise,
        message: interceptStr(e.reason.message, 130),
        startTime: Date.now(),
        fileName,
        lineNumber,
        columnNumber,
        pageUrl: window.location.href,
        breadCrumb: breadCrumb.getStack()
      })
    })
  })

  // 捕捉异步错误
  window.onerror = (msg, url, _, __, error) => {
    if (error) {
      const { fileName, columnNumber, lineNumber } =
        ErrorStackParser.parse(error)[0]

      setTimeout(() => {
        breadCrumb.push({
          type: MonitorType.Error,
          time: Date.now(),
          data: String(msg),
          breadCrumbType: BreadCrumbType.CODEERROR,
          breadCrumbStatus: 'error'
        })

        report({
          type: MonitorType.Error,
          subType: ErrorType.Async,
          message: interceptStr(msg as string, 130),
          startTime: Date.now(),
          lineNumber,
          fileName,
          columnNumber,
          pageUrl: url,
          breadCrumb: breadCrumb.getStack()
        })
      })
    }
  }
}
