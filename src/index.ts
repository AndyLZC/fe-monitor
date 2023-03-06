import { performance } from './performance'
import { behavior } from './behavior'
import { setConfig } from './config/index'
import { error, vueErrorHandler } from './error'
import type { Options, ViewModel, VueInstance } from './types'

function init(options: Options) {
  // 参数初始化
  setConfig(options)
  // 性能监控
  performance()
  // 行为监控
  behavior()
  // 错误监控
  error()
}

export default {
  install(Vue: VueInstance, options: Options) {
    init(options)
    if (Vue.config) {
      const handler = Vue.config?.errorHandler
      Vue.config.errorHandler = function (
        err: Error,
        vm: ViewModel,
        info: string
      ) {
        vueErrorHandler(err)
        if (handler) {
          handler(err, vm, info)
        }
      }
    }
  }
}
