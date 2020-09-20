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

  console.warn(menus);
  return menus;
};

/**
 * 创建默认的顶部视图
 * @param routes 路由
 * @param filter 过滤器
 */
export const createDefaultVisitedBar = (routes, filter) => {
  if (filter) {
    routes.filter((i) => filter(i));
  }
  let defaultVisitedItems = [];
  routes.forEach((route) => {
    const meta = route.meta;
    if (meta && meta.defaultVisited) {
      defaultVisitedItems.push({
        name: meta && meta.text ? meta.text : route.name,
        path: route.path,
      });
    }
  });
  return defaultVisitedItems;
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
