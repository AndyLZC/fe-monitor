function getFCP() {
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.name === "first-contentful-paint") {
        observer.disconnect();
      }
    }
  });
  observer.observe({ type: "paint", buffered: true });
}

// Unique ID creation requires a high quality random # generator. In the browser we therefore
// require the crypto API and do not support built-in fallback to lower quality random number
// generators (like Math.random()).
let getRandomValues;
const rnds8 = new Uint8Array(16);
function rng() {
  // lazy load so that environments that need to polyfill have a chance to do so
  if (!getRandomValues) {
    // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation.
    getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto);

    if (!getRandomValues) {
      throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
    }
  }

  return getRandomValues(rnds8);
}

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */

const byteToHex = [];

for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).slice(1));
}

function unsafeStringify(arr, offset = 0) {
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
}

const randomUUID = typeof crypto !== 'undefined' && crypto.randomUUID && crypto.randomUUID.bind(crypto);
var native = {
  randomUUID
};

function v4(options, buf, offset) {
  if (native.randomUUID && !buf && !options) {
    return native.randomUUID();
  }

  options = options || {};
  const rnds = options.random || (options.rng || rng)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return unsafeStringify(rnds);
}

function interceptStr(str, interceptStrLength) {
  return str.slice(0, interceptStrLength);
}
let uuid = "";
function getUUID() {
  uuid = localStorage.getItem("uuid") || "";
  if (uuid) {
    return uuid;
  }
  localStorage.setItem("uuid", v4());
}
function httpStatusMap(httpStatus) {
  if (httpStatus > 0 && httpStatus < 400) {
    return "OK";
  }
  if (httpStatus >= 400 && httpStatus < 500) {
    switch (httpStatus) {
      case 401:
        return "Unauthenticated";
      case 403:
        return "PermissionDenied";
      case 404:
        return "NotFound";
      case 409:
        return "AlreadyExists";
      case 413:
        return "FailedPrecondition";
      case 429:
        return "ResourceExhausted";
      default:
        return "InvalidArgument";
    }
  }
  if (httpStatus >= 500 && httpStatus < 600) {
    switch (httpStatus) {
      case 501:
        return "Unimplemented";
      case 503:
        return "Unavailable";
      case 504:
        return "DeadlineExceeded";
      default:
        return "InternalError";
    }
  }
  return "UnknownError";
}

const VERSION = "1.0.0";
const config = {
  url: "",
  // 上报地址
  userId: "",
  // 用户Id
  appKey: "",
  // appkey
  sdkVersion: VERSION,
  // 版本号
  uuid: getUUID(),
  domTracker: false
  // 是否追踪点击
};
function setConfig(options) {
  Object.assign(config, options);
}

function reportMethod(url, body) {
  if (navigator.sendBeacon) {
    return navigator.sendBeacon(url, body);
  }
  fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json; charset=utf-8"
    },
    body
  });
}
function report(data, immediate = false) {
  const params = {
    data: { ...config, ...data, time: Date.now() }
  };
  console.log(params);
  if (immediate) {
    return reportMethod(config.url, JSON.stringify(params));
  }
  window.requestIdleCallback(
    () => {
      reportMethod(config.url, JSON.stringify(params));
    },
    { timeout: 1e3 }
  );
}

var MonitorType = /* @__PURE__ */ ((MonitorType2) => {
  MonitorType2["Performance"] = "performance";
  MonitorType2["Behavior"] = "behavior";
  MonitorType2["Error"] = "error";
  return MonitorType2;
})(MonitorType || {});
var PerformanceType = /* @__PURE__ */ ((PerformanceType2) => {
  PerformanceType2["PV"] = "pv";
  PerformanceType2["Load"] = "load";
  PerformanceType2["FPS"] = "fps";
  PerformanceType2["DomcontentLoaded"] = "domcontentloaded";
  PerformanceType2["FirstScreenPaint"] = "first-screen-paint";
  PerformanceType2["FirstContentfulPaint"] = "first-contentful-paint";
  PerformanceType2["FirstInputDelay"] = "first-input-delay";
  PerformanceType2["LargestContentfulPaint"] = "largest-contentful-paint";
  PerformanceType2["CumlativeLayoutShift"] = "cumlative-layout-shift";
  PerformanceType2["LongTask"] = "long-task";
  PerformanceType2["Fetch"] = "fetch";
  PerformanceType2["Xhr"] = "xhr";
  return PerformanceType2;
})(PerformanceType || {});
var ErrorType = /* @__PURE__ */ ((ErrorType2) => {
  ErrorType2["Js"] = "js_error";
  ErrorType2["Promise"] = "promise_error";
  ErrorType2["Async"] = "async_error";
  ErrorType2["Fetch"] = "fetch_error";
  ErrorType2["Xhr"] = "xhr_error";
  ErrorType2["Resource"] = "resource_error";
  return ErrorType2;
})(ErrorType || {});
var BehaviorType = /* @__PURE__ */ ((BehaviorType2) => {
  BehaviorType2["pushState"] = "pushState";
  BehaviorType2["hashChange"] = "hashChange";
  BehaviorType2["pv"] = "pv";
  BehaviorType2["accessDuration"] = "accessDuration";
  BehaviorType2["click"] = "click";
  return BehaviorType2;
})(BehaviorType || {});
var BreadCrumbType = /* @__PURE__ */ ((BreadCrumbType2) => {
  BreadCrumbType2["HTTP"] = "Http";
  BreadCrumbType2["Click"] = "Click";
  BreadCrumbType2["RESOURCE"] = "Resource_Error";
  BreadCrumbType2["CODEERROR"] = "Code_Error";
  BreadCrumbType2["ROUTE"] = "Route";
  return BreadCrumbType2;
})(BreadCrumbType || {});

const frames = [];
const BLOCKING_FRAME = 20;
const LAST = 3;
function getFps() {
  let frame = 0;
  let lastTime = Date.now();
  function calculateFrame() {
    const now = Date.now();
    frame = frame + 1;
    if (lastTime + 1e3 <= now) {
      const fps = Math.round(frame / (now - lastTime) / 1e3);
      frames.push(fps);
      frame = 0;
      lastTime = now;
    }
    if (frames.length >= 60) {
      report({
        type: MonitorType.Performance,
        subType: PerformanceType.FPS,
        frames,
        isBlocking: calculateBlocking(frames)
      });
      frames.length = 0;
    }
  }
  requestAnimationFrame(calculateFrame);
}
function calculateBlocking(frames2) {
  let count = 0;
  for (const frame of frames2) {
    count = frame < BLOCKING_FRAME ? count + 1 : 0;
  }
  return count >= LAST;
}

let observer;
let timer;
let entries = [];
const viewPortWidth = window.innerWidth;
const viewPortHeight = window.innerHeight;
const ignoreDOMList = ["STYLE", "SCRIPT", "LINK", "META"];
function getFirstScreenPaint() {
  observer = new MutationObserver((mutationRecords) => {
    checkDomChange();
    const entry = {
      startTime: 0,
      children: []
    };
    for (const record of mutationRecords) {
      if (record.addedNodes.length) {
        for (const node of record.addedNodes) {
          const el = node;
          if (el.nodeType === 1 && !ignoreDOMList.includes(el.tagName) && !isIgnoreDOM(el) && isInScreen(el)) {
            entry.children.push(el);
          }
        }
      }
    }
    if (entry.children.length) {
      entries.push(entry);
      entry.startTime = +performance.now().toFixed(1);
    }
  });
  observer.observe(document, {
    childList: true,
    // 监听添加或删除子节点
    subtree: true,
    // 监听整个子树
    characterData: true,
    // 监听元素的文本是否变化
    attributes: true
    // 监听元素的属性是否变化
  });
}
function checkDomChange() {
  cancelAnimationFrame(timer);
  timer = requestAnimationFrame(() => {
    if (document.readyState === "complete") {
      observer.disconnect();
      const t = getRenderTime();
      report({
        type: MonitorType.Performance,
        subType: PerformanceType.FirstScreenPaint,
        startTime: t
      });
      return entries = null;
    }
    checkDomChange();
  });
}
function getRenderTime() {
  let startTime = 0;
  entries.forEach((entry) => {
    if (entry.startTime > startTime) {
      startTime = entry.startTime;
    }
  });
  performance.getEntriesByType("resource").forEach((item) => {
    if (item.initiatorType === "img" && item.fetchStart < startTime && item.responseEnd > startTime) {
      startTime = item.responseEnd;
    }
  });
  return startTime;
}
function isInScreen(dom) {
  const { left, top } = dom.getBoundingClientRect();
  return left <= viewPortWidth && top <= viewPortHeight;
}
function isIgnoreDOM(el) {
  return window.getComputedStyle(el).display === "none";
}

function getCLS() {
  let observer;
  let clsValue = 0;
  let sessionValue = 0;
  let sessionEntries = [];
  const entryHandler = (entryList) => {
    for (const entry of entryList.getEntries()) {
      if (!entry.hadRecentInput) {
        const firstSessionEntry = sessionEntries[0];
        const lastSessionEntry = sessionEntries[sessionEntries.length - 1];
        if (sessionValue && entry.startTime - lastSessionEntry.startTime < 1e3 && entry.startTime - firstSessionEntry.startTime < 5e3) {
          sessionValue += entry.value;
          sessionEntries.push(entry);
        } else {
          sessionValue = entry.value;
          sessionEntries = [entry];
        }
        if (sessionValue > clsValue) {
          clsValue = sessionValue;
          observer.disconnect();
          report({
            type: MonitorType.Performance,
            subType: PerformanceType.CumlativeLayoutShift,
            startTime: performance.now(),
            value: sessionValue
          });
        }
      }
    }
  };
  observer = new PerformanceObserver(entryHandler);
  observer.observe({ type: "layout-shift", buffered: true });
}

function getFID() {
  const observer = new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      const e = entry;
      observer.disconnect();
      report({
        type: MonitorType.Performance,
        subType: PerformanceType.FirstInputDelay,
        startTime: +(e.processingStart - e.startTime).toFixed(1)
      });
    }
  });
  observer.observe({ type: "first-input", buffered: true });
}

function getLCP() {
  const observer = new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      observer.disconnect();
      report({
        type: MonitorType.Performance,
        subType: PerformanceType.LargestContentfulPaint,
        startTime: entry.startTime
      });
    }
  });
  observer.observe({
    type: "largest-contentful-paint",
    buffered: true
  });
}

class BreadCrumb {
  maxBreadcrumbs;
  stack = [];
  constructor() {
    this.maxBreadcrumbs = 20;
  }
  push(data) {
    if (this.stack.length >= this.maxBreadcrumbs) {
      this.shift();
    }
    this.stack.push(data);
  }
  shift() {
    return this.stack.shift() !== void 0;
  }
  getStack() {
    return this.stack;
  }
}
const breadCrumb = new BreadCrumb();

const originalFetch = window.fetch;
function rewriteFetch() {
  window.fetch = function newFetch(url, config$1) {
    const startTime = Date.now();
    const reportData = {
      startTime,
      url,
      pageUrl: window.location.href,
      method: (config$1?.method || "GET").toUpperCase(),
      subType: PerformanceType.Fetch,
      type: MonitorType.Performance
    };
    let data;
    return originalFetch(url, config$1).then((res) => {
      data = res.clone();
      return res;
    }).catch((err) => {
      reportData.status = -1;
      reportData.success = false;
      reportData.message = err.message;
      reportData.type = MonitorType.Error;
      reportData.subType = ErrorType.Fetch;
      throw err;
    }).finally(() => {
      reportData.endTime = Date.now();
      reportData.duration = reportData.endTime - reportData.startTime;
      function finalReport() {
        if (!config.url.includes(reportData.url)) {
          breadCrumb.push({
            type: MonitorType.Behavior,
            time: Date.now(),
            data: reportData,
            breadCrumbType: BreadCrumbType.HTTP,
            breadCrumbStatus: reportData.success ? "success" : "error"
          });
          report({ ...reportData, breadCrumb: breadCrumb.getStack() });
        }
      }
      if (data) {
        return data.json().then((result) => {
          const message = result.message || result.msg || httpStatusMap(result.code || result.status);
          reportData.status = result.code || result.status;
          reportData.message = message;
          reportData.success = message === "OK";
          reportData.type = message === "OK" ? MonitorType.Performance : MonitorType.Error;
          reportData.subType = message === "OK" ? PerformanceType.Fetch : ErrorType.Fetch;
          finalReport();
        });
      } else {
        finalReport();
      }
    });
  };
}

const originalXhrProto = XMLHttpRequest.prototype;
const originalXhrOpen = originalXhrProto.open;
const originalXhrSend = originalXhrProto.send;
function rewriteXhr() {
  originalXhrProto.open = function(...args) {
    this.method = args[0];
    this.url = args[1];
    originalXhrOpen.apply(this, args);
  };
  originalXhrProto.send = function(...args) {
    this.startTime = Date.now();
    const onLoadend = () => {
      this.endTime = Date.now();
      this.duration = this.endTime - this.startTime;
      const {
        statusText,
        response,
        duration,
        startTime,
        endTime,
        url,
        method
      } = this;
      const result = JSON.parse(response);
      const status = result.code || result.status;
      const message = result.message || result.msg || httpStatusMap(status) || statusText;
      const reportData = {
        status,
        duration,
        startTime,
        endTime,
        url,
        pageUrl: window.location.href,
        method: (method || "GET").toUpperCase(),
        message,
        success: message === "OK",
        subType: message === "OK" ? PerformanceType.Xhr : ErrorType.Xhr,
        type: message === "OK" ? MonitorType.Performance : MonitorType.Error
      };
      if (!config.url.includes(reportData.url)) {
        breadCrumb.push({
          type: MonitorType.Behavior,
          time: Date.now(),
          data: reportData,
          breadCrumbType: BreadCrumbType.HTTP,
          breadCrumbStatus: reportData.success ? "success" : "error"
        });
        report({ ...reportData, breadCrumb: breadCrumb.getStack() });
      }
      this.removeEventListener("loadend", onLoadend, true);
    };
    this.addEventListener("loadend", onLoadend, true);
    originalXhrSend.apply(this, args);
  };
}

function performance$1() {
  getCLS();
  getFCP();
  getFID();
  getFirstScreenPaint();
  getFps();
  getLCP();
  rewriteFetch();
  rewriteXhr();
}

function pv() {
  report({
    type: MonitorType.Behavior,
    subType: BehaviorType.pv,
    startTime: performance.now(),
    pageUrl: window.location.href,
    referrer: document.referrer,
    uuid: getUUID()
  });
}

function accessDuration() {
  window.addEventListener("beforeunload", () => {
    report(
      {
        type: MonitorType.Behavior,
        subType: BehaviorType.accessDuration,
        startTime: performance.now(),
        pageURL: window.location.href,
        uuid: getUUID()
      },
      true
    );
  });
}

function htmlElementAsString(target) {
  if (target) {
    const tagName = target.tagName.toLowerCase();
    if (tagName === "body") {
      return null;
    }
    if (config.domTracker && target.attributes.tracked !== void 0) {
      const innerText = target.innerText || "";
      return `<${tagName}>${innerText}</${tagName}>`;
    }
  }
  return null;
}
function click() {
  document.addEventListener("click", function() {
    const str = htmlElementAsString(this.activeElement);
    if (!str) {
      return;
    }
    breadCrumb.push({
      type: MonitorType.Behavior,
      time: Date.now(),
      data: str,
      breadCrumbType: BreadCrumbType.Click,
      breadCrumbStatus: "info"
    });
  });
}

const createHistoryEvent = (type) => {
  const origin = history[type];
  return function(...args) {
    const res = origin.apply(this, args);
    window.dispatchEvent(new Event(type));
    return res;
  };
};

function pageChange() {
  window.history.pushState = createHistoryEvent("pushState");
  window.history.replaceState = createHistoryEvent("replaceState");
  if (config.historyTracker) {
    let from = window.location.href;
    let fromPathName = window.location.pathname;
    window.addEventListener("pushState", () => {
      const to = window.location.href;
      const toPathname = window.location.pathname;
      breadCrumb.push({
        type: MonitorType.Behavior,
        time: Date.now(),
        data: [fromPathName, toPathname],
        breadCrumbType: BreadCrumbType.ROUTE,
        breadCrumbStatus: "info"
      });
      setTimeout(() => {
        report({
          from,
          to,
          type: MonitorType.Behavior,
          subType: BehaviorType.pushState,
          breadCrumb: breadCrumb.getStack()
        });
        from = to;
        fromPathName = toPathname;
      }, 100);
    });
  }
  if (config.hashTracker) {
    let oldUrl = "";
    window.addEventListener("hashchange", (e) => {
      const newUrl = e.newURL;
      breadCrumb.push({
        type: MonitorType.Behavior,
        time: Date.now(),
        data: [oldUrl, newUrl],
        breadCrumbType: BreadCrumbType.Click,
        breadCrumbStatus: "info"
      });
      setTimeout(() => {
        report({
          from: oldUrl,
          to: newUrl,
          type: MonitorType.Behavior,
          subType: BehaviorType.hashChange,
          breadCrumb: breadCrumb.getStack()
        });
      }, 100);
      oldUrl = newUrl;
    });
  }
}

function behavior() {
  click();
  pv();
  pageChange();
  accessDuration();
}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

var errorStackParserExports = {};
var errorStackParser = {
  get exports(){ return errorStackParserExports; },
  set exports(v){ errorStackParserExports = v; },
};

var stackframeExports = {};
var stackframe = {
  get exports(){ return stackframeExports; },
  set exports(v){ stackframeExports = v; },
};

var hasRequiredStackframe;

function requireStackframe () {
	if (hasRequiredStackframe) return stackframeExports;
	hasRequiredStackframe = 1;
	(function (module, exports) {
		(function(root, factory) {
		    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js, Rhino, and browsers.

		    /* istanbul ignore next */
		    {
		        module.exports = factory();
		    }
		}(commonjsGlobal, function() {
		    function _isNumber(n) {
		        return !isNaN(parseFloat(n)) && isFinite(n);
		    }

		    function _capitalize(str) {
		        return str.charAt(0).toUpperCase() + str.substring(1);
		    }

		    function _getter(p) {
		        return function() {
		            return this[p];
		        };
		    }

		    var booleanProps = ['isConstructor', 'isEval', 'isNative', 'isToplevel'];
		    var numericProps = ['columnNumber', 'lineNumber'];
		    var stringProps = ['fileName', 'functionName', 'source'];
		    var arrayProps = ['args'];
		    var objectProps = ['evalOrigin'];

		    var props = booleanProps.concat(numericProps, stringProps, arrayProps, objectProps);

		    function StackFrame(obj) {
		        if (!obj) return;
		        for (var i = 0; i < props.length; i++) {
		            if (obj[props[i]] !== undefined) {
		                this['set' + _capitalize(props[i])](obj[props[i]]);
		            }
		        }
		    }

		    StackFrame.prototype = {
		        getArgs: function() {
		            return this.args;
		        },
		        setArgs: function(v) {
		            if (Object.prototype.toString.call(v) !== '[object Array]') {
		                throw new TypeError('Args must be an Array');
		            }
		            this.args = v;
		        },

		        getEvalOrigin: function() {
		            return this.evalOrigin;
		        },
		        setEvalOrigin: function(v) {
		            if (v instanceof StackFrame) {
		                this.evalOrigin = v;
		            } else if (v instanceof Object) {
		                this.evalOrigin = new StackFrame(v);
		            } else {
		                throw new TypeError('Eval Origin must be an Object or StackFrame');
		            }
		        },

		        toString: function() {
		            var fileName = this.getFileName() || '';
		            var lineNumber = this.getLineNumber() || '';
		            var columnNumber = this.getColumnNumber() || '';
		            var functionName = this.getFunctionName() || '';
		            if (this.getIsEval()) {
		                if (fileName) {
		                    return '[eval] (' + fileName + ':' + lineNumber + ':' + columnNumber + ')';
		                }
		                return '[eval]:' + lineNumber + ':' + columnNumber;
		            }
		            if (functionName) {
		                return functionName + ' (' + fileName + ':' + lineNumber + ':' + columnNumber + ')';
		            }
		            return fileName + ':' + lineNumber + ':' + columnNumber;
		        }
		    };

		    StackFrame.fromString = function StackFrame$$fromString(str) {
		        var argsStartIndex = str.indexOf('(');
		        var argsEndIndex = str.lastIndexOf(')');

		        var functionName = str.substring(0, argsStartIndex);
		        var args = str.substring(argsStartIndex + 1, argsEndIndex).split(',');
		        var locationString = str.substring(argsEndIndex + 1);

		        if (locationString.indexOf('@') === 0) {
		            var parts = /@(.+?)(?::(\d+))?(?::(\d+))?$/.exec(locationString, '');
		            var fileName = parts[1];
		            var lineNumber = parts[2];
		            var columnNumber = parts[3];
		        }

		        return new StackFrame({
		            functionName: functionName,
		            args: args || undefined,
		            fileName: fileName,
		            lineNumber: lineNumber || undefined,
		            columnNumber: columnNumber || undefined
		        });
		    };

		    for (var i = 0; i < booleanProps.length; i++) {
		        StackFrame.prototype['get' + _capitalize(booleanProps[i])] = _getter(booleanProps[i]);
		        StackFrame.prototype['set' + _capitalize(booleanProps[i])] = (function(p) {
		            return function(v) {
		                this[p] = Boolean(v);
		            };
		        })(booleanProps[i]);
		    }

		    for (var j = 0; j < numericProps.length; j++) {
		        StackFrame.prototype['get' + _capitalize(numericProps[j])] = _getter(numericProps[j]);
		        StackFrame.prototype['set' + _capitalize(numericProps[j])] = (function(p) {
		            return function(v) {
		                if (!_isNumber(v)) {
		                    throw new TypeError(p + ' must be a Number');
		                }
		                this[p] = Number(v);
		            };
		        })(numericProps[j]);
		    }

		    for (var k = 0; k < stringProps.length; k++) {
		        StackFrame.prototype['get' + _capitalize(stringProps[k])] = _getter(stringProps[k]);
		        StackFrame.prototype['set' + _capitalize(stringProps[k])] = (function(p) {
		            return function(v) {
		                this[p] = String(v);
		            };
		        })(stringProps[k]);
		    }

		    return StackFrame;
		}));
} (stackframe));
	return stackframeExports;
}

(function (module, exports) {
	(function(root, factory) {
	    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js, Rhino, and browsers.

	    /* istanbul ignore next */
	    {
	        module.exports = factory(requireStackframe());
	    }
	}(commonjsGlobal, function ErrorStackParser(StackFrame) {

	    var FIREFOX_SAFARI_STACK_REGEXP = /(^|@)\S+:\d+/;
	    var CHROME_IE_STACK_REGEXP = /^\s*at .*(\S+:\d+|\(native\))/m;
	    var SAFARI_NATIVE_CODE_REGEXP = /^(eval@)?(\[native code])?$/;

	    return {
	        /**
	         * Given an Error object, extract the most information from it.
	         *
	         * @param {Error} error object
	         * @return {Array} of StackFrames
	         */
	        parse: function ErrorStackParser$$parse(error) {
	            if (typeof error.stacktrace !== 'undefined' || typeof error['opera#sourceloc'] !== 'undefined') {
	                return this.parseOpera(error);
	            } else if (error.stack && error.stack.match(CHROME_IE_STACK_REGEXP)) {
	                return this.parseV8OrIE(error);
	            } else if (error.stack) {
	                return this.parseFFOrSafari(error);
	            } else {
	                throw new Error('Cannot parse given Error object');
	            }
	        },

	        // Separate line and column numbers from a string of the form: (URI:Line:Column)
	        extractLocation: function ErrorStackParser$$extractLocation(urlLike) {
	            // Fail-fast but return locations like "(native)"
	            if (urlLike.indexOf(':') === -1) {
	                return [urlLike];
	            }

	            var regExp = /(.+?)(?::(\d+))?(?::(\d+))?$/;
	            var parts = regExp.exec(urlLike.replace(/[()]/g, ''));
	            return [parts[1], parts[2] || undefined, parts[3] || undefined];
	        },

	        parseV8OrIE: function ErrorStackParser$$parseV8OrIE(error) {
	            var filtered = error.stack.split('\n').filter(function(line) {
	                return !!line.match(CHROME_IE_STACK_REGEXP);
	            }, this);

	            return filtered.map(function(line) {
	                if (line.indexOf('(eval ') > -1) {
	                    // Throw away eval information until we implement stacktrace.js/stackframe#8
	                    line = line.replace(/eval code/g, 'eval').replace(/(\(eval at [^()]*)|(,.*$)/g, '');
	                }
	                var sanitizedLine = line.replace(/^\s+/, '').replace(/\(eval code/g, '(').replace(/^.*?\s+/, '');

	                // capture and preseve the parenthesized location "(/foo/my bar.js:12:87)" in
	                // case it has spaces in it, as the string is split on \s+ later on
	                var location = sanitizedLine.match(/ (\(.+\)$)/);

	                // remove the parenthesized location from the line, if it was matched
	                sanitizedLine = location ? sanitizedLine.replace(location[0], '') : sanitizedLine;

	                // if a location was matched, pass it to extractLocation() otherwise pass all sanitizedLine
	                // because this line doesn't have function name
	                var locationParts = this.extractLocation(location ? location[1] : sanitizedLine);
	                var functionName = location && sanitizedLine || undefined;
	                var fileName = ['eval', '<anonymous>'].indexOf(locationParts[0]) > -1 ? undefined : locationParts[0];

	                return new StackFrame({
	                    functionName: functionName,
	                    fileName: fileName,
	                    lineNumber: locationParts[1],
	                    columnNumber: locationParts[2],
	                    source: line
	                });
	            }, this);
	        },

	        parseFFOrSafari: function ErrorStackParser$$parseFFOrSafari(error) {
	            var filtered = error.stack.split('\n').filter(function(line) {
	                return !line.match(SAFARI_NATIVE_CODE_REGEXP);
	            }, this);

	            return filtered.map(function(line) {
	                // Throw away eval information until we implement stacktrace.js/stackframe#8
	                if (line.indexOf(' > eval') > -1) {
	                    line = line.replace(/ line (\d+)(?: > eval line \d+)* > eval:\d+:\d+/g, ':$1');
	                }

	                if (line.indexOf('@') === -1 && line.indexOf(':') === -1) {
	                    // Safari eval frames only have function names and nothing else
	                    return new StackFrame({
	                        functionName: line
	                    });
	                } else {
	                    var functionNameRegex = /((.*".+"[^@]*)?[^@]*)(?:@)/;
	                    var matches = line.match(functionNameRegex);
	                    var functionName = matches && matches[1] ? matches[1] : undefined;
	                    var locationParts = this.extractLocation(line.replace(functionNameRegex, ''));

	                    return new StackFrame({
	                        functionName: functionName,
	                        fileName: locationParts[0],
	                        lineNumber: locationParts[1],
	                        columnNumber: locationParts[2],
	                        source: line
	                    });
	                }
	            }, this);
	        },

	        parseOpera: function ErrorStackParser$$parseOpera(e) {
	            if (!e.stacktrace || (e.message.indexOf('\n') > -1 &&
	                e.message.split('\n').length > e.stacktrace.split('\n').length)) {
	                return this.parseOpera9(e);
	            } else if (!e.stack) {
	                return this.parseOpera10(e);
	            } else {
	                return this.parseOpera11(e);
	            }
	        },

	        parseOpera9: function ErrorStackParser$$parseOpera9(e) {
	            var lineRE = /Line (\d+).*script (?:in )?(\S+)/i;
	            var lines = e.message.split('\n');
	            var result = [];

	            for (var i = 2, len = lines.length; i < len; i += 2) {
	                var match = lineRE.exec(lines[i]);
	                if (match) {
	                    result.push(new StackFrame({
	                        fileName: match[2],
	                        lineNumber: match[1],
	                        source: lines[i]
	                    }));
	                }
	            }

	            return result;
	        },

	        parseOpera10: function ErrorStackParser$$parseOpera10(e) {
	            var lineRE = /Line (\d+).*script (?:in )?(\S+)(?:: In function (\S+))?$/i;
	            var lines = e.stacktrace.split('\n');
	            var result = [];

	            for (var i = 0, len = lines.length; i < len; i += 2) {
	                var match = lineRE.exec(lines[i]);
	                if (match) {
	                    result.push(
	                        new StackFrame({
	                            functionName: match[3] || undefined,
	                            fileName: match[2],
	                            lineNumber: match[1],
	                            source: lines[i]
	                        })
	                    );
	                }
	            }

	            return result;
	        },

	        // Opera 10.65+ Error.stack very similar to FF/Safari
	        parseOpera11: function ErrorStackParser$$parseOpera11(error) {
	            var filtered = error.stack.split('\n').filter(function(line) {
	                return !!line.match(FIREFOX_SAFARI_STACK_REGEXP) && !line.match(/^Error created at/);
	            }, this);

	            return filtered.map(function(line) {
	                var tokens = line.split('@');
	                var locationParts = this.extractLocation(tokens.pop());
	                var functionCall = (tokens.shift() || '');
	                var functionName = functionCall
	                    .replace(/<anonymous function(: (\w+))?>/, '$2')
	                    .replace(/\([^)]*\)/g, '') || undefined;
	                var argsRaw;
	                if (functionCall.match(/\(([^)]*)\)/)) {
	                    argsRaw = functionCall.replace(/^[^(]+\(([^)]*)\)$/, '$1');
	                }
	                var args = (argsRaw === undefined || argsRaw === '[arguments not available]') ?
	                    undefined : argsRaw.split(',');

	                return new StackFrame({
	                    functionName: functionName,
	                    args: args,
	                    fileName: locationParts[0],
	                    lineNumber: locationParts[1],
	                    columnNumber: locationParts[2],
	                    source: line
	                });
	            }, this);
	        }
	    };
	}));
} (errorStackParser));

var ErrorStackParser = errorStackParserExports;

function vueErrorHandler(e) {
  try {
    const target = e.target;
    if (!target || e.target && !e.target.localName) {
      const stackFrame = ErrorStackParser.parse(!target ? e : e.error)[0];
      const { fileName, columnNumber, lineNumber } = stackFrame;
      setTimeout(() => {
        breadCrumb.push({
          type: MonitorType.Error,
          time: Date.now(),
          data: e.message,
          breadCrumbType: BreadCrumbType.CODEERROR,
          breadCrumbStatus: "error"
        });
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
        });
      });
    }
  } catch (error2) {
    console.log(error2);
  }
}
function error() {
  window.addEventListener(
    "error",
    (e) => {
      const target = e.target;
      if (!target) {
        return;
      }
      if (target.src || target.href) {
        const url = target.src || target.href;
        setTimeout(() => {
          breadCrumb.push({
            type: MonitorType.Error,
            time: Date.now(),
            data: url,
            breadCrumbType: BreadCrumbType.RESOURCE,
            breadCrumbStatus: "error"
          });
          return report({
            type: MonitorType.Error,
            subType: ErrorType.Resource,
            startTime: Date.now(),
            message: target.outerHTML,
            resourceType: target.tagName,
            url,
            pageUrl: window.location.href,
            breadCrumb: breadCrumb.getStack()
          });
        });
      }
    },
    true
  );
  window.addEventListener("unhandledrejection", (e) => {
    const { fileName, columnNumber, lineNumber } = ErrorStackParser.parse(
      e.reason
    )[0];
    setTimeout(() => {
      breadCrumb.push({
        type: MonitorType.Error,
        time: Date.now(),
        data: interceptStr(e.reason.message, 130),
        breadCrumbType: BreadCrumbType.CODEERROR,
        breadCrumbStatus: "error"
      });
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
      });
    });
  });
  window.onerror = (msg, url, _, __, error2) => {
    if (error2) {
      const { fileName, columnNumber, lineNumber } = ErrorStackParser.parse(error2)[0];
      setTimeout(() => {
        breadCrumb.push({
          type: MonitorType.Error,
          time: Date.now(),
          data: String(msg),
          breadCrumbType: BreadCrumbType.CODEERROR,
          breadCrumbStatus: "error"
        });
        report({
          type: MonitorType.Error,
          subType: ErrorType.Async,
          message: interceptStr(msg, 130),
          startTime: Date.now(),
          lineNumber,
          fileName,
          columnNumber,
          pageUrl: url,
          breadCrumb: breadCrumb.getStack()
        });
      });
    }
  };
}

function init(options) {
  setConfig(options);
  performance$1();
  behavior();
  error();
}
var index = {
  install(Vue, options) {
    init(options);
    if (Vue.config) {
      const handler = Vue.config?.errorHandler;
      Vue.config.errorHandler = function(err, vm, info) {
        vueErrorHandler(err);
        if (handler) {
          handler(err, vm, info);
        }
      };
    }
  }
};

export { index as default };
//# sourceMappingURL=monitor.js.map
