export interface DefaultOptions {
  url: string
  uuid: string
  userId: string
  appKey: string
  sdkVersion: string | number
  domTracker: boolean
  hashTracker: boolean
  historyTracker: boolean
}

// url 必传
export interface Options extends Partial<DefaultOptions> {
  url: string
  userId: string
  appKey: string
}

export enum MonitorType {
  Performance = 'performance',
  Behavior = 'behavior',
  Error = 'error'
}

export enum PerformanceType {
  PV = 'pv',
  Load = 'load',
  FPS = 'fps',
  DomcontentLoaded = 'domcontentloaded',
  FirstScreenPaint = 'first-screen-paint',
  FirstContentfulPaint = 'first-contentful-paint',
  FirstInputDelay = 'first-input-delay',
  LargestContentfulPaint = 'largest-contentful-paint',
  CumlativeLayoutShift = 'cumlative-layout-shift',
  LongTask = 'long-task',
  Fetch = 'fetch',
  Xhr = 'xhr'
}

export enum ErrorType {
  Js = 'js_error',
  Promise = 'promise_error',
  Async = 'async_error',
  Fetch = 'fetch_error',
  Xhr = 'xhr_error',
  Resource = 'resource_error'
}

export enum BehaviorType {
  pushState = 'pushState',
  hashChange = 'hashChange',
  pv = 'pv',
  accessDuration = 'accessDuration',
  click = 'click'
}

export interface ReportData {
  type: MonitorType
  subType?: PerformanceType | ErrorType | BehaviorType
  [key: string]: any
}

export interface xhrOption {
  startTime: number
  url: RequestInfo | URL
  method: string
  subType: string
  type: string
  endTime?: number
  status?: number
  success?: boolean
  duration?: number
}

export enum BreadCrumbType {
  HTTP = 'Http',
  Click = 'Click',
  RESOURCE = 'Resource_Error',
  CODEERROR = 'Code_Error',
  ROUTE = 'Route'
}

export interface IBreadCrumb {
  breadCrumbType: BreadCrumbType
  breadCrumbStatus: 'success' | 'error' | 'info'
  data: unknown
  time: number
  type: MonitorType
}

export interface VueInstance {
  config?: VueConfiguration
  mixin(hooks: { [key: string]: () => void }): void
  util: {
    warn(...input: any): void
  }
  version: string
}
export interface VueConfiguration {
  silent: boolean
  errorHandler(err: Error, vm: ViewModel, info: string): void
  warnHandler(msg: string, vm: ViewModel, trace: string): void
  ignoredElements: (string | RegExp)[]
  keyCodes: { [key: string]: number | number[] }
  async: boolean
}

export interface ViewModel {
  [key: string]: any
  $root: Record<string, unknown>
  $options: {
    [key: string]: any
    name?: string
    // vue2.6
    propsData?: Record<string, unknown>
    _componentTag?: string
    __file?: string
    props?: Record<string, unknown>
  }
  $props: Record<string, unknown>
}
