<template>
  <n-breadcrumb>
    <n-breadcrumb-item>
      <n-icon :component="ApertureOutline" /> 北京总行</n-breadcrumb-item
    >
    <n-breadcrumb-item>
      <n-icon :component="ApertureOutline" /> 天津分行</n-breadcrumb-item
    >
    <n-breadcrumb-item>
      <n-icon :component="ApertureOutline" /> 平山道支行</n-breadcrumb-item
    >
  </n-breadcrumb>
</template>

<script lang="ts" setup>
import { ApertureOutline } from "@vicons/ionicons5";
</script>
