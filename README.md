# fe-monitor 前端监控 demo

## 错误还原

![错误还原](https://i.imgtg.com/2023/03/06/YNHRL.png)

#### 行为追踪

![行为追踪](https://i.imgtg.com/2023/03/06/YNLji.png)

### 数据看板

![数据看板](https://i.imgtg.com/2023/03/06/YNQyt.png)

### 使用

```shell
   # rollup 打包sdk
   yarn && yarn build

   # dev 访问 localhost:9999
   cd example
   yarn && yarn build && node server.js
```

## 前端监控原理

### 1、性能数据采集

通过 `PerformanceObserver` 来获取主要性能指标

#### 1.1 FP

FP(first-paint), 从页面加载到第一个像素到屏幕上的页面，相当于白屏时间

```js
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.name === 'first-paint') {
      observer.disconnect()
    }
  }
})
observer.observe({ type: 'paint', buffered: true })
```

#### 1.2 FCP

FCP(first-contentful-paint), 从页面加载开始到页面内容的任何部分在屏幕上完成渲染时间。对于该指标，“内容”是指文本、图像、svg 元素

```js
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.name === 'first-contentful-paint') {
      observer.disconnect()
    }
  }
})
observer.observe({ type: 'paint', buffered: true })
```

#### 1.3 LCP(largest-contentful-paint)

可视区域内可见的最大图像或文本块完成渲染的相对时间。
`FCP` 和 `LCP` 的区别是：`FCP` 只要任意内容绘制完成就触发，`LCP` 是最大内容渲染完成时触发。
`LCP`考察元素有

- 包含文本节点或其他行内级文本元素子元素的块级元素。
- `<img>`元素
- `<video>`元素

```js
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.name === 'first-largest-paint') {
      observer.disconnect()
    }
  }
})
observer.observe({ type: 'paint', buffered: true })
```

#### 1.4 FSP(first-screen-paint) 首屏渲染时间

首屏即可视窗口的第一屏，主要通过 MutationObserver 来获取首屏渲染时间。
计算过程如下：

- MutationObserver 监听 document 对象， 每当 DOM 元素发生变更时，触发事件。
- 判断当前 DOM 元素是否在首屏内，在 requestAnimationFrame() 回调函数中获取当前时间，作为它的绘制时间
- 将最后一个 DOM 元素的绘制时间和首屏中所有加载的 DOM 元素时间做对比，将最多值作为首屏时间

```js
// 监听 DOM 元素变化
observer = new MutationObserver((mutationRecords) => {
    checkDomChange()
    const entry: Entry = {
      startTime: 0,
      children: []
    }
    for (const record of mutationRecords) {
      if (record.addedNodes.length) {
        for (const node of record.addedNodes) {
          const el = node as Element
          if (
            el.nodeType === 1 &&
            !ignoreDOMList.includes(el.tagName) &&
            !isIgnoreDOM(el) &&
            isInScreen(el)
          ) {
            entry.children.push(el)
          }
        }
      }
    }

    if (entry.children.length) {
      entries.push(entry)
      entry.startTime = +performance.now().toFixed(1)
    }
  })
  observer.observe(document, {
    childList: true, // 监听添加或删除子节点
    subtree: true, // 监听整个子树
    characterData: true, // 监听元素的文本是否变化
    attributes: true // 监听元素的属性是否变化
  })
```

判断是否在首屏

```js
function isInScreen(dom: Element) {
  const { left, top } = dom.getBoundingClientRect()
  return left <= viewPortWidth && top <= viewPortHeight
}
```

`DOM` 绘制时间，要在浏览器绘制成功后再获取， 所以要调用 `requestAnimationFrame`；什么时候进行上报？ 一般是在 `load`事件触发后， 这时候`DOM`不再变化了

```js
function checkDomChange() {
  cancelAnimationFrame(timer)
  timer = requestAnimationFrame(() => {
    if (document.readyState === 'complete') {
      observer.disconnect()
      const t = getRenderTime()
      report({
        type: MonitorType.Performance,
        subType: PerformanceType.FirstScreenPaint,
        startTime: t
      })
      return (entries = null)
    }
    checkDomChange()
  })
}
```

## 2、错误监控

#### 2.1 window.onerror

window.onerror 可以捕捉 js 运行时错误、异步错误, `try/catch` 能捕获常规运行时错误，语法错误和异步错误不行

```javascript
//  js 运行时错误 ✅
console.log(foo.length.length)
// 异步错误 ✅
setTimeout(() => {
  console.log(foo.length.length)
})
window.onerror = () => {
  console.log('Uncaught TypeError: Cannot read properties of undefined (reading 'length')')
}
```

#### 2.2 window.addEventListener('error')

window.addEventLister 可以捕获资源加载错误

```javascript
// 图片、script、css加载错误，都能被捕获 ✅
<script>
  window.addEventListener('error', (error) => {
     console.log('捕获到异常：', error);
  }, true)
</script>
<img src="https://xxx.com/1.png">

// 但 new Image错误不能捕获 ❌
<script>
  window.addEventListener('error', (error) => {
    console.log('捕获到异常：', error);
  }, true)
</script>
<script>
  new Image().src="https://xxx.com/1.png"
</script>
```

#### 2.3 unhandledrejection

`unhandledrejection` 捕获 `promise` 错误

```javascript
window.addEventListener('unhandledrejection', function (e) {
  console.log('promise 错误捕捉', e)
})
fetch('https://xxx.com/1.png')
```

#### 2.4 Vue 错误

`Vue` 会捕获所有 Vue 单文件组件继承的代码，所以在 `Vue` 里面出现的错误，并不会直接被 `window.onerror` 捕获，而是会抛给` `Vue.config.errorHandler`。

```javascript
const handler = Vue.config?.errorHandler
Vue.config.errorHandler = function (err: Error, vm: ViewModel, info: string) {
  vueErrorHandler(err)
  if (handler) {
    handler(err, vm, info)
  }
}
```

## 3、行为收集

#### 3.1 PV、UV

PV 是页面浏览量， UV 是用户访问量。 PV 只要访问一次页面就算一次， UV 同一天内多次访问只算一次

```javascript
export function pv() {
  report({
    type: MonitorType.Behavior,
    subType: BehaviorType.pv,
    startTime: performance.now(),
    pageUrl: window.location.href,
    referrer: document.referrer,
    uuid: getUUID()
  })
}
```

#### 3.2 用户点击 DOM 元素

设置了 `domTracker` 选项点击追踪，且元素添加了 `tracked` 将会被追踪点击 `DOM` 行为

```javascript
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
```

#### 3.3 路由跳转

路由跳转模式有两种方式， `hash` 和 `history`, 分别监听 `hashChange` 和 `pushState` 事件，主要记录当前跳转页面以及将要跳转的页面

```javascript
// pushState
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
})

// hashChange
window.addEventListener('hashchange', (e: HashChangeEvent) => {
  const newUrl = e.newURL
  breadCrumb.push({
    type: MonitorType.Behavior,
    time: Date.now(),
    data: [oldUrl, newUrl],
    breadCrumbType: BreadCrumbType.Click,
    breadCrumbStatus: 'info'
  })
})
```

## 4、数据上报方式和时机

### 1. 上报方法

- [sendBeacon](https://developer.mozilla.org/zh-CN/docs/Web/API/Navigator/sendBeacon)
- ajax 、fetch (post 方法)
- image

#### 1.1 sendBeacon

`navigator.sendBeacon()` 方法可用于通过 `HTTP POST` 将少量数据 异步 传输到 `Web` 服务器。
它主要用于将统计数据发送到 Web 服务器，同时避免了用传统技术（如：XMLHttpRequest）发送分析数据的一些问题
使用 `sendBeacon()` 方法会使用户代理在有机会时异步地向服务器发送数据，同时不会延迟页面的卸载或影响下一导航的载入性能，

#### 1.2 image

图片天然可跨域，能兼容所有的浏览器， 而 js 和 css 等其他资源文件可能会出现安全拦截和跨域加载问题

```js
const img = new Image()
img.src = '请求的url'
```

但由于是一个 `get` 请求，上报的数据量大小在不同浏览器上下限不一致（2kb ~ 8kb), 可能导致无法上报完整数据的情况

#### 1.3 ajax、fetch

- 有严格的跨域限制
- 上报请求有可能阻塞业务
- 请求容易丢失 （被浏览器强制 cache)
