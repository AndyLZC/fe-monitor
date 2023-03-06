<template>
  <n-space vertical>
    <n-layout has-sider>
      <n-layout-sider
        bordered
        collapse-mode="width"
        :collapsed-width="64"
        :width="240"
        :collapsed="collapsed"
        show-trigger
        @collapse="collapsed = true"
        @expand="collapsed = false"
      >
        <div class="monitor">monitor</div>
        <n-menu
          v-model:value="activeKey"
          :collapsed="collapsed"
          :collapsed-width="64"
          :collapsed-icon-size="22"
          :options="menuOptions"
          @update:value="goTo"
        />
      </n-layout-sider>
      <n-layout :style="computedStyle" class="content-wrapper">
        <router-view v-slot="{ Component, route }">
          <transition name="fade-slide" mode="out-in" :appear="true">
            <keep-alive>
              <component :is="Component" :key="route.name" />
            </keep-alive>
          </transition>
        </router-view>
      </n-layout>
    </n-layout>
  </n-space>
  <div class="theme" @click="changeTheme">
    <n-icon
      size="18"
      :color="theme ? '#ffffff' : '#000'"
      :component="theme ? WeatherMoon20Filled : WeatherSunny20Filled"
    ></n-icon>
  </div>
</template>

<script lang="ts" setup>
import { h, ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { NIcon } from "naive-ui";
import type { MenuOption } from "naive-ui";
import { useTheme } from "../stores/theme";
import { storeToRefs } from "pinia";
import { BookOutline as BookIcon, LogoNodejs } from "@vicons/ionicons5";
import { WeatherSunny20Filled, WeatherMoon20Filled, ErrorCircle12Filled, BoxMultiple24Regular, Home16Regular } from "@vicons/fluent";
const router = useRouter();
const route = useRoute();

const activeKey = ref<string | null>(route.name);
const collapsed = ref(false);

const store = useTheme();
const { changeTheme } = store;
const { theme } = storeToRefs(store);
const modeColor = computed(() => (theme.value ? "#18181c" : "#d1d1d1"));

const computedStyle = computed(() => {
  const marginLeft = collapsed.value ? "64px" : "240px";
  return { marginLeft };
});

function renderIcon(icon: any) {
  return () =>
    h(
      NIcon,
      { size: 18, style: { marginRight: "3px" } },
      {
        default: () => h(icon),
      }
    );
}

function goTo(name) {
  router.push({
    name,
  });
}

const menuOptions: MenuOption[] = [
  {
    label: "首页",
    key: "home",
    icon: renderIcon(Home16Regular),
  },
  {
    label: "关于",
    key: "about",
    icon: renderIcon(BookIcon),
  },
  {
    label: "js 错误",
    key: "error",
    icon: renderIcon(LogoNodejs),
  },
  {
    label: "页面性能",
    key: "performance",
    icon: renderIcon(BoxMultiple24Regular),
  },
  {
    label: "接口错误",
    key: "request",
    icon: renderIcon(ErrorCircle12Filled),
  },
];
</script>

<style scope>
.theme {
  position: fixed;
  right: 30px;
  top: 30px;
  height: 38px;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  z-index: 999;
  background-color: v-bind(modeColor);
  cursor: pointer;
}

.monitor {
  margin: 10px 0 0 35px;
  font-size: 22px;
  font-weight: 600;
  font-style: italic;
}

.n-layout-sider {
  position: fixed;
  top: 0;
  bottom: 0;
}

.n-menu {
  font-weight: 600;
  font-style: italic;
}
.content-wrapper {
  margin-top: 30px;
  padding: 0px 20px 20px 20px;
  transition: all 0.3s var(--n-bezier);
}
</style>
