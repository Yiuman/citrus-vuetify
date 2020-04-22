import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../view/login/index'
import Layout from '../view/layout/index'

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'layout',
        component: Layout,
    },
    {
        path: '/login',
        name: 'login',
        component: Login,
    },
    {
        path: '/',
        component: Layout,
        children: [
            {
                path: '/users',
                component: () => import('../view/user/index'),
                name: 'userList',
            },
        ]
    }
];

const router = new VueRouter({
    routes,
});

export default router
