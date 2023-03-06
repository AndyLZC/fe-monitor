import type { ReportData } from '../types'
import defaultConfig from '../config'

function reportMethod(url: string, body: string) {
  if (navigator.sendBeacon) {
    return navigator.sendBeacon(url, body)
  }
  fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json; charset=utf-8'
    },
    body
  })
}

export function report(data: ReportData, immediate = false) {
  const params = {
    data: { ...defaultConfig, ...data, time: Date.now() }
  }
  console.log(params)
  if (immediate) {
    return reportMethod(defaultConfig.url, JSON.stringify(params))
  }

  window.requestIdleCallback(
    () => {
      reportMethod(defaultConfig.url, JSON.stringify(params))
    },
    { timeout: 1000 }
  )
}
