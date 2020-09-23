import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../view/login/index";
import Layout from "../view/layout/index";
import { createMenus, createDefaultVisitedBar, listToTree } from "../utils/app";
import { SYSTEM_CONFIG } from "../config";
import store from "../store";
// import menu from "../store/modules/menu";

Vue.use(VueRouter);

/**
 * 系统路由
 */
const systemRoutes = [
  {
    path: "/",
    name: "layout",
    component: Layout,
    meta: {
      text: "首页",
      defaultVisited: true,
    },
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/",
    name: "layout",
    component: Layout,
    children: [
      {
        path: "/usercenter",
        name: "usercenter",
        component: () => import("@/view/user/index.vue"),
        meta: {
          text: "个人中心",
        },
      },
    ],
  }
];

/**
 * 静态菜单路由
 */
export const constantRoutes = [
  {
    path: "/",
    component: Layout,
    children: [
      {
        path: "/users",
        name: "users",
        component: () => import("../components/CrudTable.vue"),
        props: { namespace: "/rest/users" },
        meta: {
          text: "用户管理",
          icon: "mdi-account",
        },
      },
    ],
  },
  {
    path: "/",
    component: Layout,
    children: [
      {
        path: "/roles",
        name: "roles",
        component: () => import("../components/CrudTable.vue"),
        props: { namespace: "/rest/roles" },
        meta: {
          text: "角色管理",
          icon: "mdi-account-cowboy-hat",
        },
      },
    ],
  },
  {
    path: "/",
    component: Layout,
    children: [
      {
        path: "/organs",
        name: "organs",
        component: () => import("../components/CrudTree.vue"),
        props: { namespace: "/rest/organs" },
        meta: {
          text: "组织机构管理",
          icon: "mdi-file-tree-outline",
        },
      },
    ],
  },
  {
    path: "/",
    component: Layout,
    children: [
      {
        path: "/menus",
        name: "menus",
        component: () => import("../components/CrudTree.vue"),
        props: { namespace: "/rest/menus" },
        meta: {
          text: "菜单管理",
          icon: "mdi-microsoft-xbox-controller-menu",
        },
      },
    ],
  },
  {
    path: "/",
    component: Layout,
    children: [
      {
        path: "/resources",
        name: "resources",
        component: () => import("../components/CrudTable.vue"),
        props: { namespace: "/rest/resources" },
        meta: {
          text: "资源管理",
          icon: "mdi-semantic-web",
        },
      },
    ],
  },
  {
    path: "/",
    component: Layout,
    children: [
      {
        path: "/scopes",
        name: "scopes",
        component: () => import("../view/system/DataScopes.vue"),
        props: { namespace: "/rest/scopes" },
        meta: {
          text: "数据范围管理",
          icon: "mdi-account-arrow-left",
        },
      },
    ],
  },
  {
    path: "/",
    component: Layout,
    children: [
      {
        path: "/auth",
        name: "auth",
        component: () => import("../view/system/Authority.vue"),
        props: { namespace: "/rest/auth" },
        meta: {
          text: "权限管理",
          icon: "mdi-shield-account-outline",
        },
      },
    ],
  },
];

const router = new VueRouter({
  routes: [...systemRoutes],
});

router.beforeEach((to, from, next) => {
  if (to.path === "/login") {
    next();
  }
  if (
    store.state.user.token ||
    SYSTEM_CONFIG.permitUrls.some((i) => i === to.path)
  ) {
    if (store.state.user.token && !store.state.user.userOnlineInfo) {
      store
        .dispatch("user/getCurrent")
        .then(() => {
          addRouters();
          next({ ...to, replace: true });
        })
        .catch((err) => {
          console.warn(err);
          router.replace("/login");
        });
    } else {
    //   addRouters();
      next();
    }
  } else {
    router.replace("/login");
  }
});

// store.state.menu.menus = createMenus(constantRoutes);
const addRouters = () => {
  const menus = store.state.user.userOnlineInfo.menus;
  const menuTree = [];
  listToTree(menus, menuTree, null);
  const routers = menus
    .filter((menu) => menu.path)
    .map((menu) => {
      return {
        path: "/",
        component: Layout,
        children: [
          {
            path: menu.path || "",
            name: menu.resourceName,
            component: loadComponent(menu.component),
            props: { namespace: menu.path },
            meta: {
              id: menu.resourceId,
              parentId: menu.parentId,
              text: menu.resourceName,
              icon: menu.icon,
            },
          },
        ],
      };
    });

  router.addRoutes(routers);
  store.state.menu.menus = createMenus(menuTree);
  store.state.menu.inited = true;
};

const loadComponent = (component) => {
  //必须@/
  return (resolve) => require([`@/${component}`], resolve);
};
store.state.visited.visitedItems = createDefaultVisitedBar(systemRoutes);
export default router;
