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
                name: 'users',
                component: () => import('../components/CrudTable.vue'),
                props: {namespace: '/rest/users'},
                meta: {
                    text: '用户管理',
                    icon: 'mdi-account'
                }
            },
        ]
    },
    {
        path: '/',
        component: Layout,
        children: [
            {
                path: '/roles',
                name: 'roles',
                component: () => import('../components/CrudTable.vue'),
                props: {namespace: '/rest/roles'},
                meta: {
                    text: '角色管理',
                    icon: 'mdi-account-cowboy-hat'
                }
            },
        ]
    },
    {
        path: '/',
        component: Layout,
        children: [
            {
                path: '/organs',
                name: 'organs',
                component: () => import('../components/CrudTree.vue'),
                props: {namespace: '/rest/organs'},
                meta: {
                    text: '组织机构管理',
                    icon: 'mdi-file-tree-outline'
                }
            },
        ]
    },
    {
        path: '/',
        component: Layout,
        children: [
            {
                path: '/menus',
                name: 'menus',
                component: () => import('../components/CrudTree.vue'),
                props: {namespace: '/rest/menus'},
                meta: {
                    text: '菜单管理',
                    icon: 'mdi-microsoft-xbox-controller-menu'
                }
            },
        ]
    },
    {
        path: '/',
        component: Layout,
        children: [
            {
                path: '/resources',
                name: 'resources',
                component: () => import('../components/CrudTable.vue'),
                props: {namespace: '/rest/resources'},
                meta: {
                    text: '资源管理',
                    icon: 'mdi-semantic-web'
                }
            },
        ]
    },
    {
        path: '/',
        component: Layout,
        children: [
            {
                path: '/scopes',
                name: 'scopes',
                component: () => import('../components/CrudTable.vue'),
                props: {namespace: '/rest/scopes'},
                meta: {
                    text: '数据范围管理',
                    icon: 'mdi-account-arrow-left'
                }
            },
        ]
    },
    {
        path: '/',
        component: Layout,
        children: [
            {
                path: '/auth',
                name: 'auth',
                component: () => import('../view/system/Authority.vue'),
                props: {namespace: '/rest/auth'},
                meta: {
                    text: '权限管理',
                    icon: 'mdi-shield-account-outline'
                }
            },
        ]
    },
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
