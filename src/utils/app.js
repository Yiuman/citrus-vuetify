/**
 * 根据路由初始化菜单
 * @param routes 路由
 * @param filter 过滤器
 * @returns {*} 菜单列表
 */
export const createMenus = (routes, filter) => {
  const menus = [];
  if (filter) {
    routes = routes.filter((i) => filter(i));
  }
  routes.forEach((route) => {
    if (route.path === "/" && route.children) {
      createMenus(route.children).forEach((item) => {
        menus.push(item);
      });
    } else {
      let children;
      if (route.children) {
        children = createMenus(route.children);
      }

      const meta = route;
      menus.push({
        text: meta && meta.text ? meta.text : route.resourceName,
        icon: meta ? meta.icon : "",
        path: route.path,
        children,
      });
    }
  });

  return menus;
};

/**
 * 创建默认的顶部视图
 * @param routes 路由
 * @param filter 过滤器
 */
export const createDefaultVisitedBar = (routes, filter, barArray = []) => {
  if (filter) {
    routes.filter((i) => filter(i));
  }
  routes.forEach((route) => {
    if (route.children) {
      createDefaultVisitedBar(route.children, null, barArray);
    } else {
      const meta = route.meta;
      if (meta && meta.defaultVisited) {
        barArray.push({
          name: meta && meta.text ? meta.text : route.name,
          path: route.path,
        });
      }
    }
  });
  return barArray;
};

/**
 * 数组转树形结构
 * @param list 源数组
 * @param tree 树
 * @param parentId 父ID
 */
export const listToTree = (list, tree, parentId) => {
  list.forEach((item) => {
    // 判断是否为父级菜单
    if (item.parentId === parentId) {
      const child = {
        ...item,
        key: item.key || item.name,
        children: [],
      };
      // 迭代 list， 找到当前菜单相符合的所有子菜单
      listToTree(list, child.children, item.id);
      // 删掉不存在 children 值的属性
      if (child.children.length <= 0) {
        delete child.children;
      }
      // 加入到树中
      tree.push(child);
    }
  });
};

/**
 *
 * 根据当前路由生成面包屑
 * @param {*} currentRoute 当前路由
 * @param {*} list 返回的面包屑集合
 * @param {*} index 层级下标倒序
 */
export const createBreadCrumbs = (currentRoute, list = [], index = 0) => {
  if (currentRoute) {
    let text = currentRoute.meta
      ? currentRoute.meta.text
      : currentRoute.resourceName || currentRoute.name;
    list.push({
      text,
      disabled: index == 0 || currentRoute.path === null,
      href: currentRoute.path,
      index,
    });

    if (currentRoute.meta && currentRoute.meta.parent) {
      createBreadCrumbs(currentRoute.meta.parent, list, ++index);
    }
  }
  list.sort((o1, o2) => o2.index - o1.index);
  return list;
};
