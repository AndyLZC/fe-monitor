import { ref } from "vue";
import { defineStore } from "pinia";
import { darkTheme } from "naive-ui";
import type { GlobalTheme } from "naive-ui";

export const useTheme = defineStore("theme", () => {
  const theme = ref<GlobalTheme | null>(darkTheme);

  function changeTheme() {
    theme.value = !theme.value ? darkTheme : null;
  }

  return { theme, changeTheme };
});
