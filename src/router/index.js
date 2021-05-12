import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../views/Home.vue";
const routes = [
    {
        path: "/",
        name: "Home",
        component: Home,
    },
    {
        path: "/about",
        name: "About",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ "../views/About.vue"),
    },
    {
        path: "/graph",
        redirect: "/graph/base",
    },
    {
        path: "/graph/base",
        name: "Base",
        component: () => import(/* webpackChunkName: "gbase" */ "../views/mxgraph/Base.vue"),
    },
    {
        path: "/graph/baseGraph",
        name: "BaseGraph",
        component: () => import(
        /* webpackChunkName: "baseGraph" */ "../views/mxgraph/BaseGraph.vue"),
    },
    {
        path: "/graph/anchors",
        name: "Anchors",
        component: () => import(/* webpackChunkName: "anchors" */ "../views/mxgraph/Anchors.vue"),
    },
    {
        path: "/graph/animation",
        name: "Animation",
        component: () => import(
        /* webpackChunkName: "animation" */ "../views/mxgraph/Animation.vue"),
    },
    {
        path: "/graph/boundary",
        name: "Boundary",
        component: () => import(
        /* webpackChunkName: "boundary" */ "../views/mxgraph/Boundary.vue"),
    },
    {
        path: "/graph/clipboard",
        name: "Clipboard",
        component: () => import(
        /* webpackChunkName: "clipboard" */ "../views/mxgraph/Clipboard.vue"),
    },
    {
        path: "/graph/codec",
        name: "Codec",
        component: () => import(/* webpackChunkName: "codec" */ "../views/mxgraph/Codec.vue"),
    },
    {
        path: "/graph/myflow",
        name: "MyFlow",
        component: () => import(/* webpackChunkName: "myflow" */ "../views/mxgraph/MyFlow.vue"),
    },
];
const router = createRouter({
    history: createWebHashHistory(),
    routes,
});
export default router;
//# sourceMappingURL=index.js.map