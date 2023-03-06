import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import monitor from "../../dist/monitor.js";
import "./assets/main.css";
import naive from "naive-ui";
import { createPinia } from "pinia";
import "uno.css";

const app = createApp(App);

app.use(createPinia());
app.use(naive);
app.use(router);
app.use(monitor, {
  url: "http://localhost:9999/reportData",
  userId: "123456",
  appKey: "demo1",
  historyTracker: true,
  domTracker: true,
});

app.mount("#app");
