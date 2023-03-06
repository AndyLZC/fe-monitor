import { createRouter, createWebHistory } from "vue-router";
import BaseLayout from "../layout/BaseLayout.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "web",
      component: BaseLayout,
      redirect: "/home",
      children: [
        {
          path: "/home",
          name: "home",
          component: () => import("../views/HomeView.vue"),
        },
        {
          path: "/about",
          name: "about",
          component: () => import("../views/AboutView.vue"),
        },
        {
          path: "/performance",
          name: "performance",
          component: () => import("../views/performance/PerformanceView.vue"),
        },
        {
          path: "/error",
          name: "error",
          component: () => import("../views/ErrorView.vue"),
        },
        {
          path: "/request",
          name: "request",
          component: () => import("../views/RequestView.vue"),
        },
      ],
    },
  ],
});

export default router;
