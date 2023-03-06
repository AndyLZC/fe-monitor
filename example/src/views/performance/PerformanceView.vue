<template>
  <div class="mt-15">
    <n-space vertical :size="20">
      <n-grid cols="s:1 m:2 l:4" responsive="screen" :x-gap="16" :y-gap="16">
        <n-grid-item v-for="item in cardData" :key="item.id">
          <gradient-bg
            class="rounded-4"
            :start-color="item.colors[0]"
            :end-color="item.colors[1]"
          >
            <div class="flex-col-center p-3 rounded-5">
              <h3>{{ item.title }}</h3>
              <div class="text-30px font-500">
                <n-number-animation
                  ref="numberAnimationInstRef"
                  :from="0"
                  :duration="3000"
                  show-separator
                  :to="item.value"
                />
                ms
              </div>
            </div>
          </gradient-bg>
        </n-grid-item>
      </n-grid>
      <n-card class="rounded-4">
        <n-grid cols="4" item-responsive>
          <n-grid-item>
            <n-space vertical :size="10" class="mt-10">
              <p class="title">首次绘制时间 (FP)</p>
              <p class="title">首次内容绘制时间（FCP)</p>
              <p class="title">第一个有意义的内容出现时间（FMP)</p>
              <p class="title">最多内容块渲染时间（LCP)</p>
            </n-space>
          </n-grid-item>
          <n-grid-item span="3">
            <div ref="lineRef" class="h-100"></div>
          </n-grid-item>
        </n-grid>
      </n-card>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted } from "vue";
import GradientBg from "./components/GradientBg.vue";
import type { NumberAnimationInst } from "naive-ui";
import * as echarts from "echarts/core";
import { LabelLayout, UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import type { LineSeriesOption } from "echarts/charts";
import {
  DatasetComponent,
  LegendComponent,
  GridComponent,
  TitleComponent,
  TooltipComponent,
  TransformComponent,
} from "echarts/components";
import type {
  DatasetComponentOption,
  GridComponentOption,
  TitleComponentOption,
  TooltipComponentOption,
} from "echarts/components";

type ECOption = echarts.ComposeOption<
  | LineSeriesOption
  | TitleComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | DatasetComponentOption
>;

echarts.use([
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LineChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
]);

const lineRef = ref<HTMLElement | null>(null);

const numberAnimationInstRef = ref<NumberAnimationInst | null>(null);
const lineOptions = {
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "cross",
      label: {
        backgroundColor: "#6a7985",
      },
    },
  },
  legend: {
    data: ["FP", "FCP", "FMP", "LCP"],
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true,
  },
  xAxis: [
    {
      type: "category",
      boundaryGap: false,
      data: [
        "06:00",
        "08:00",
        "10:00",
        "12:00",
        "14:00",
        "16:00",
        "18:00",
        "20:00",
        "22:00",
        "24:00",
      ],
    },
  ],
  yAxis: [
    {
      type: "value",
    },
  ],
  series: [
    {
      color: "#8e9dff",
      name: "FP",
      type: "line",
      smooth: true,
      stack: "Total",
      areaStyle: {
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0.25,
              color: "#8e9dff",
            },
            {
              offset: 1,
              color: "#fff",
            },
          ],
        },
      },
      emphasis: {
        focus: "series",
      },
      data: [399, 400, 404, 679, 888, 555, 645, 876, 345, 456, 788, 890],
    },
    {
      color: "#26deca",
      name: "FCP",
      type: "line",
      smooth: true,
      stack: "Total",
      areaStyle: {
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0.25,
              color: "#26deca",
            },
            {
              offset: 1,
              color: "#fff",
            },
          ],
        },
      },
      emphasis: {
        focus: "series",
      },
      data: [399, 400, 404, 679, 888, 555, 645, 876, 345, 456, 788, 890],
    },
    {
      color: "#26deca",
      name: "FMP",
      type: "line",
      smooth: true,
      stack: "Total",
      areaStyle: {
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0.25,
              color: "#26deca",
            },
            {
              offset: 1,
              color: "#fff",
            },
          ],
        },
      },
      emphasis: {
        focus: "series",
      },
      data: [399, 400, 404, 679, 888, 555, 645, 876, 345, 456, 788, 890],
    },
    {
      color: "#26deca",
      name: "LCP",
      type: "line",
      smooth: true,
      stack: "Total",
      areaStyle: {
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0.25,
              color: "#26deca",
            },
            {
              offset: 1,
              color: "#fff",
            },
          ],
        },
      },
      emphasis: {
        focus: "series",
      },
      data: [399, 780, 604, 679, 888, 555, 645, 876, 345, 456, 788, 890],
    },
  ],
};
interface CardData {
  id: string;
  title: string;
  value: number;
  unit: string;
  colors: [string, string];
  icon: string;
}

let chart;

onMounted(async () => {
  console.log(lineRef.value);
  chart = echarts.init(lineRef.value as HTMLElement, "dark");
  await nextTick();

  chart!.setOption({ ...lineOptions, backgroundColor: "transparent" });
});

const cardData: CardData[] = [
  {
    id: "visit",
    title: "FP平均时间",
    value: 530,
    unit: "",
    colors: ["#ec4786", "#b955a4"],
    icon: "ant-design:bar-chart-outlined",
  },
  {
    id: "amount",
    title: "FCP平均时间",
    value: 400,
    unit: "$",
    colors: ["#865ec0", "#5144b4"],
    icon: "ant-design:money-collect-outlined",
  },
  {
    id: "download",
    title: "FMP平均时间",
    value: 666,
    unit: "",
    colors: ["#56cdf3", "#719de3"],
    icon: "carbon:document-download",
  },
  {
    id: "trade",
    title: "LCP平均时间",
    value: 999,
    unit: "",
    colors: ["#fcbc25", "#f68057"],
    icon: "ant-design:trademark-circle-outlined",
  },
];
</script>

<style scoped>
.title {
  font-size: 18px;
  font-weight: 600;
  font-style: italic;
}
</style>
