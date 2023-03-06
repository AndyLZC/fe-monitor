<script setup lang="ts">
import { ref, h, nextTick, onActivated } from "vue";
import { findCodeBySourceMap } from "../util/index";
import dayjs from "dayjs";
import { NButton } from "naive-ui";
import { renderTableIcon } from "../util/renderTableIcon";
import {
  PersonCircleOutline,
  TimeOutline,
  BuildOutline,
  EyeOutline,
  BugOutline,
} from "@vicons/ionicons5";
import {
  DocumentPageBottomCenter20Regular,
  Box16Regular,
} from "@vicons/fluent";

onActivated(async () => {
  fetchErrorList();
});

const data: any = ref([]);
const columns = createColumns();

const code = ref<HTMLElement | null>(null);

const showModal = ref(false);

const showBehaviorLine = ref(false);

const breadcrumbs = ref<breadcrumbItem[]>([]);

interface breadcrumbItem {
  time: number;
  breadCrumbStatus: "info" | "success" | "error";
  breadCrumbType: string;
  data: any;
  type: string;
}

function breadcrumbContentMap(breadcrumb: breadcrumbItem) {
  const { success, message, url, status } = breadcrumb.data;
  const typeMap: any = {
    Click: `点击了dom: ${breadcrumb.data}`,
    Http: `请求了接口: ${url} 请求${success ? "成功" : "失败"} (${status}:  ${
      message || ""
    })
    `,
    Code_Error: `代码错误: ${breadcrumb.data}`,
    Resource_Error: `资源加载错误: ${breadcrumb.data}`,
    Route: `页面跳转: 从 ${breadcrumb.data[0]} 到 ${breadcrumb.data[1]}`,
  };

  return typeMap[breadcrumb.breadCrumbType];
}

function errorTypeMap(type: string) {
  const map: any = {
    js_error: "js 错误",
    async_error: "异步错误",
    promise_error: "promise 错误",
    resource_error: "资源加载错误",
    xhr_error: "xhr 请求错误",
    fetch_error: "fetch 请求错误",
  };

  return map[type];
}

function fetchErrorList() {
  setTimeout(async () => {
    const res: any = await fetch("http://localhost:9999/getErrorList", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await res.json();
    data.value = result.data;
    console.log(data.value);
  }, 100);
}

async function jsError() {
  fetchErrorList();
  const a: any = true;
  console.log(a.length.length);
}

async function asyncError() {
  fetchErrorList();
  setTimeout(() => {
    JSON.parse("");
  });
}

async function promiseError() {
  fetchErrorList();
  new Promise((resolve) => {
    let foo: any = {};
    foo.bar.baz();
    resolve(666);
  });
}

function fetchError() {
  fetch("http://localhost:9999/fetchError", {
    method: "POST",
    body: JSON.stringify({
      foo: "foo",
    }),
  }).then(() => {
    fetchErrorList();
  });
}

async function xhrError() {
  let ajax = new XMLHttpRequest();
  ajax.open("GET", "http://localhost:9999/xhrError");
  ajax.setRequestHeader("content-type", "application/json");
  ajax.onreadystatechange = function () {
    if (ajax.readyState == 4) {
      console.log(126, ajax);
      fetchErrorList();
    }
    if (ajax.status === 200 || ajax.status === 304) {
      console.log("ajax", ajax);
    }
  };
  ajax.send();
  ajax.addEventListener("loadend", () => {});
}

async function resourceError() {
  let script = document.createElement("script");
  script.type = "text/javascript";
  script.src = "https://xxx/index.js";
  document.body.appendChild(script);
  // 资源加载失败
  script.onerror = () => {
    fetchErrorList();
  };
}

function formatTime(time: number) {
  return dayjs(time).format("YYYY-MM-DD HH:mm:ss");
}

function createColumns() {
  return [
    {
      align: "center",
      title() {
        return renderTableIcon(Box16Regular, "项目");
      },
      key: "appKey",
    },
    {
      align: "center",
      title() {
        return renderTableIcon(BuildOutline, "sdk 版本");
      },
      key: "sdkVersion",
    },
    {
      align: "center",

      title() {
        return renderTableIcon(PersonCircleOutline, "用户id");
      },
      key: "userId",
    },
    {
      align: "center",

      title() {
        return renderTableIcon(BugOutline, "报错类型");
      },
      key: "type",
      render: (row: any) => {
        return errorTypeMap(row.subType);
      },
    },
    {
      align: "center",
      title() {
        return renderTableIcon(DocumentPageBottomCenter20Regular, "报错页面");
      },
      key: "pageUrl",
    },

    {
      align: "center",
      title() {
        return renderTableIcon(TimeOutline, "报错时间");
      },
      key: "startTime",
      render: (row: any) => {
        return dayjs(row.time).format("YYYY-MM-DD HH:mm:ss");
      },
    },
    {
      align: "center",
      title() {
        return renderTableIcon(EyeOutline, "查看报错信息");
      },
      key: "code",
      render(row: any, index: number) {
        return h(
          NButton,
          {
            strong: true,
            type: "primary",
            size: "small",
            onClick: async () => {
              showModal.value = true;
              const currRow = data.value[index];
              let innerHTML = "";
              console.log(currRow.subType);
              if (["fetch_error", "xhr_error"].includes(currRow.subType)) {
                innerHTML = `报错接口： <div class="header">${currRow.url}</div><div class="footer">${currRow.status}: ${currRow.message}</div>`;
              } else if (currRow.subType === "resource_error") {
                innerHTML = `资源加载错误: <span class="header">${currRow.resourceType.toLowerCase()}</span><div class="footer">${
                  currRow.url
                }</div>`;
              } else {
                innerHTML = (await findCodeBySourceMap(currRow)) || "";
              }

              await nextTick();
              if (code.value) {
                code.value.innerHTML = innerHTML;
              }
            },
          },
          { default: () => "查看" }
        );
      },
    },
    {
      align: "center",
      title() {
        return renderTableIcon(EyeOutline, "查看行为记录");
      },
      key: "record",
      render(row: any) {
        return h(
          NButton,
          {
            strong: true,
            type: "primary",
            size: "small",
            onClick: async () => {
              console.log(row, "131");
              showBehaviorLine.value = true;
              breadcrumbs.value = row.breadCrumb as breadcrumbItem[];
              console.log(breadcrumbs.value);
            },
          },
          { default: () => "查看" }
        );
      },
    },
  ];
}
</script>

<template>
  <div>
    <n-space>
      <span @click="jsError">
        <n-button strong secondary round tracked> js 错误 </n-button>
      </span>
      <span @click="asyncError">
        <n-button strong secondary round type="primary"> 异步错误 </n-button>
      </span>
      <span @click="promiseError">
        <n-button strong secondary round type="warning">
          promise 错误
        </n-button>
      </span>
      <span @click="resourceError">
        <n-button strong secondary round type="error"> 资源加载错误 </n-button>
      </span>
      <span @click="xhrError">
        <n-button strong secondary round type="success">
          xhr 请求错误
        </n-button>
      </span>
      <span @click="fetchError">
        <n-button strong secondary round type="warning">
          fetch 请求错误
        </n-button>
      </span>
      <!-- <n-button @click="fetchErrorList"> fetch error list </n-button> -->
      <span>
        <n-button>
          <RouterLink to="/about">goTo About page</RouterLink>
        </n-button>
      </span>
    </n-space>
    <div style="margin-top: 50px">
      <n-data-table :columns="columns" :data="data" />
    </div>
    <n-modal v-model:show="showModal">
      <n-card
        style="
          width: 600px;
          border-radius: 6px;
          background-color: rgb(24, 24, 28);
        "
        title="错误信息"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
        z-index="999"
      >
        <template #header>
          <div class="cicle" @click="showModal = false">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              data-v-5dd093fe=""
              class="close"
              style="
                --n-bezier: cubic-bezier(0.4, 0, 0.2, 1);
                font-size: 10px;
                height: 12px;
                width: 12px;
                color: #333;
              "
            >
              <path
                d="M289.94 256l95-95A24 24 0 0 0 351 127l-95 95l-95-95a24 24 0 0 0-34 34l95 95l-95 95a24 24 0 1 0 34 34l95-95l95 95a24 24 0 0 0 34-34z"
                fill="currentColor"
              ></path>
            </svg>
          </div>
        </template>
        <pre><code ref="code" class="javascript"></code>
    </pre>
      </n-card>
    </n-modal>
    <n-modal v-model:show="showBehaviorLine">
      <n-card
        style="
          width: 1000px;
          border-radius: 6px;
          background-color: rgb(24, 24, 28);
        "
        title="行为记录"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
        z-index="999"
      >
        <template #header>
          <div class="cicle" @click="showBehaviorLine = false">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              data-v-5dd093fe=""
              class="close"
              style="
                --n-bezier: cubic-bezier(0.4, 0, 0.2, 1);
                font-size: 10px;
                height: 12px;
                width: 12px;
                color: #333;
              "
            >
              <path
                d="M289.94 256l95-95A24 24 0 0 0 351 127l-95 95l-95-95a24 24 0 0 0-34 34l95 95l-95 95a24 24 0 1 0 34 34l95-95l95 95a24 24 0 0 0 34-34z"
                fill="currentColor"
              ></path>
            </svg>
          </div>
        </template>
        <n-timeline>
          <n-timeline-item
            v-for="item of breadcrumbs"
            :key="item.time"
            :type="item.breadCrumbStatus"
            :content="breadcrumbContentMap(item)"
            :time="formatTime(time)"
          >
          </n-timeline-item>
        </n-timeline>
      </n-card>
    </n-modal>
  </div>
</template>

<style>
pre {
  margin-bottom: -25px;
}
code .hight-light {
  text-decoration: underline wavy red;
}

code .code-index {
  display: inline-block;
  min-width: 20px;
}

code .header {
  color: #42b883;
  font-size: 16px;
  font-style: italic;
  font-weight: 600;
  text-decoration: underline;
  margin-bottom: 25px;
}

code .footer {
  margin-top: 30px;
  font-weight: 600;
  color: #cfa4ff;
  font-size: 17px;
}

.cicle {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 10px;
  top: 10px;
  width: 14px;
  border-radius: 100%;
  height: 14px;
  background-color: #fc625d;
}

.close {
  opacity: 0;
}
.close:hover {
  opacity: 1;
  transition: all 0.6s cubic-bezier(0.075, 0.82, 0.165, 1);
}

h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
