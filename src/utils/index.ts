import { v4 as uuidv4 } from 'uuid'

export function on(
  target: Window | HTMLElement,
  event: string,
  handler: EventListenerOrEventListenerObject,
  capture: false
) {
  if (typeof target?.addEventListener === 'function') {
    target.addEventListener(event, handler, capture)
  }
}

export function off(
  target: Window | HTMLElement,
  event: string,
  handler: EventListenerOrEventListenerObject,
  capture: false
) {
  if (typeof target?.removeEventListener === 'function') {
    target.removeEventListener(event, handler, capture)
  }
}

export function interceptStr(str: string, interceptStrLength: number) {
  return str.slice(0, interceptStrLength)
}

let uuid = ''
export function getUUID() {
  uuid = localStorage.getItem('uuid') || ''
  if (uuid) {
    return uuid
  }

  localStorage.setItem('uuid', uuidv4())
}

export function httpStatusMap(httpStatus: number) {
  if (httpStatus > 0 && httpStatus < 400) {
    return 'OK'
  }
  if (httpStatus >= 400 && httpStatus < 500) {
    switch (httpStatus) {
      case 401:
        return 'Unauthenticated'
      case 403:
        return 'PermissionDenied'
      case 404:
        return 'NotFound'
      case 409:
        return 'AlreadyExists'
      case 413:
        return 'FailedPrecondition'
      case 429:
        return 'ResourceExhausted'
      default:
        return 'InvalidArgument'
    }
  }
  if (httpStatus >= 500 && httpStatus < 600) {
    switch (httpStatus) {
      case 501:
        return 'Unimplemented'
      case 503:
        return 'Unavailable'
      case 504:
        return 'DeadlineExceeded'
      default:
        return 'InternalError'
    }
  }
  return 'UnknownError'
}
