<script setup lang="ts">
import { RouterView } from "vue-router";
import { NConfigProvider } from "naive-ui";
import { useTheme } from "./stores/theme";
import { computed, watchEffect } from "vue";
const store = useTheme();

const theme = computed(() => store.theme);

watchEffect(() => {
  document.body.style.background = theme.value?.common?.bodyColor || "";
});
</script>

<template>
  <NConfigProvider :theme="theme">
    <div class="wrapper">
      <router-view></router-view>
    </div>
  </NConfigProvider>
</template>

<style>
body {
  background-color: v-bind(theme?.common.bodyColor);
}
</style>
