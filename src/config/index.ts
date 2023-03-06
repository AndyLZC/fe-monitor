import type { Options } from '../types'
import { getUUID } from '../utils/index'
const VERSION = '1.0.0'

const config: Options = {
  url: '', // 上报地址
  userId: '', // 用户Id
  appKey: '', // appkey
  sdkVersion: VERSION, // 版本号
  uuid: getUUID(),
  domTracker: false // 是否追踪点击
}

export function setConfig(options: Options) {
  Object.assign(config, options)
}

export default config
