import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import ConfigPage from '@/views/ConfigPage.vue';
import CreditorApp from '@/views/CreditorApp.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/welcome',
    name: 'config',
    component: ConfigPage,
    meta: { requireAuth: false },
    children: [
      {
        path: '',
        component: CreditorApp,
        meta: { needLoginType: false },
      },
      {
        path: 'newuser',
        component: ConfigPage,
        meta: { needLoginType: true },
      },
      {
        path: 'existinguser',
        component: CreditorApp,
        meta: { needLoginType: true },
      },
    ],
  },
  {
    path: '/app',
    name: 'app',
    component: CreditorApp,
    meta: { requireAuth: true },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/welcome',
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
