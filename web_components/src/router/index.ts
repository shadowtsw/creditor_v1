import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import ConfigPage from "@/views/ConfigPage.vue";
import CreditorApp from "@/views/CreditorApp.vue";
import Dummy from "@/views/Dummy.vue";

// import AppNavigation from "@/views/App/AppNavigation.vue";
// import AppMain from "@/views/App/AppMain.vue";
// import AppAccountbar from "@/views/App/AppAccountbar.vue";
// import AppFooter from "@/views/App/AppFooter.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/welcome",
    name: "config",
    component: ConfigPage,
    meta: { requireAuth: false },
    children: [
      {
        path: "",
        component: CreditorApp,
        meta: { needLoginType: false },
      },
      {
        path: "newuser",
        component: ConfigPage,
        meta: { needLoginType: true },
      },
      {
        path: "existinguser",
        component: CreditorApp,
        meta: { needLoginType: true },
      },
    ],
  },
  {
    path: "/app",
    name: "app",
    component: CreditorApp,
    meta: { requireAuth: true },
    redirect: "/app/test",
    children: [
      {
        path: "test",
        components: {
          default: () =>
            import(
              /*webpackChunkName: "Navigation"*/ "../views/App/AppNavigation.vue"
            ),
          accounts: () =>
            import(
              /*webpackChunkName: "AccountBar"*/ "../views/App/AppAccountbar.vue"
            ),
          main: () =>
            import(
              /*webpackChunkName: "MainWindow"*/ "../views/App/AppMain.vue"
            ),
          footer: () =>
            import(/*webpackChunkName: "Footer"*/ "../views/App/AppFooter.vue"),
          // default: AppNavigation,
          // accounts: AppAccountbar,
          // main: AppMain,
          // footer: AppFooter,
        },
        meta: { requireAuth: true },
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/welcome",
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
