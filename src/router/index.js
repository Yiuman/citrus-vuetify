import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../view/login/index'
import Layout from '../view/layout/index'
import {createMenus, createDefaultVisitedBar} from "../utils/app";
import {SYSTEM_CONFIG} from '../config'
import store from "../store";

Vue.use(VueRouter);

/**
 * 系统路由
 */
const systemRoutes = [
    {
        path: '/',
        name: 'layout',
        component: Layout,
        meta: {
            text: '首页',
            defaultVisited: true
        }
    },
    {
        path: '/login',
        name: 'login',
        component: Login,
    }
];

/**
 * 静态菜单路由
 */
export const constantRoutes = [
    {
        path: '/',
        component: Layout,
        children: [
            {
                path: '/users',
                component: () => import('../view/user/index'),
                name: 'userList',
                meta: {
                    text: '用户管理',
                    icon: 'mdi-account'
                }
            },
        ]
    }
];

const router = new VueRouter({
    routes: [...systemRoutes, ...constantRoutes],
});

router.beforeEach((to, from, next) => {
    if (SYSTEM_CONFIG.permitUrls.some(i => i === to.path) || store.state.user.token) {
        next();
    } else {
        router.replace('/login')
    }
});

store.state.menu.menus = createMenus(constantRoutes);
store.state.visited.visitedItems = createDefaultVisitedBar(systemRoutes);
export default router
