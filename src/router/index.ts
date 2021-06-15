import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import MainPane from '@/views/main/MainPane.vue';

const routes: Array<RouteRecordRaw> = [
  // {
  //   path: '/',
  //   name: 'Home',
  //   component: Home,
  // },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ '../views/About.vue'),
  // },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: MainPane,
    children: [
      {
        path: 'home',
        name: 'home',
        component: () => import('@/views/Home.vue'),
      },
    ],
  },
  {
    path: '/process',
    name: 'process',
    component: MainPane,
    children: [
      {
        path: 'processHome',
        name: 'processHome',
        component: () => import('@/views/process/Process.vue'),
      },
    ],
  },
  {
    path: '/test',
    name: 'test',
    component: MainPane,
    children: [
      {
        path: 'testHome',
        name: 'testHome',
        component: () => import('@/views/mxgraph/Base.vue'),
      },
      {
        path: 'baseGraph',
        name: 'baseGraph',
        component: () => import('@/views/mxgraph/BaseGraph.vue'),
      },
      {
        path: 'anchors',
        name: 'anchors',
        component: () => import('@/views/mxgraph/Anchors.vue'),
      },
      {
        path: 'animation',
        name: 'animation',
        component: () => import('@/views/mxgraph/Animation.vue'),
      },
      {
        path: 'boundary',
        name: 'boundary',
        component: () => import('@/views/mxgraph/Boundary.vue'),
      },
      {
        path: 'clipboard',
        name: 'clipboard',
        component: () => import('@/views/mxgraph/Clipboard.vue'),
      },
      {
        path: 'edgeDynStyle',
        name: 'edgeDynStyle',
        component: () => import('@/views/mxgraph/EdgeDynamicStyle.vue'),
      },
      {
        path: 'autoLayout',
        name: 'autoLayout',
        component: () => import('@/views/mxgraph/AutoLayout.vue'),
      },
      {
        path: 'myflow',
        name: 'myflow',
        component: () => import(/* webpackChunkName: "myflow" */ '@/views/mxgraph/MyFlow.vue'),
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard/home',
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
