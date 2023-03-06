import { BreadCrumbType, MonitorType } from '../types'
import config from '../config/index'
import { breadCrumb } from './breadcrumb'

function htmlElementAsString(target: Element | null) {
  if (target) {
    const tagName = target.tagName.toLowerCase()
    if (tagName === 'body') {
      return null
    }
    if (config.domTracker && target.attributes.tracked !== undefined) {
      const innerText = target.innerText || ''
      return `<${tagName}>${innerText}</${tagName}>`
    }
  }
  return null
}

export function click() {
  document.addEventListener('click', function () {
    const str = htmlElementAsString(this.activeElement)
    if (!str) {
      return
    }
    breadCrumb.push({
      type: MonitorType.Behavior,
      time: Date.now(),
      data: str,
      breadCrumbType: BreadCrumbType.Click,
      breadCrumbStatus: 'info'
    })
  })
}
