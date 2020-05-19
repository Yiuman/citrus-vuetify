/**
 * 根据路由初始化菜单
 * @param routes 路由
 * @param filter 过滤器
 * @returns {*} 菜单列表
 */
export const createMenus = (routes, filter) => {
    const menus = [];
    if (filter) {
        routes = routes.filter(i => filter(i));
    }
    routes.forEach(route => {
        if (route.path === '/' && route.children) {
            createMenus(route.children).forEach(item => {
                menus.push(item);
            })
        } else {
            let children;
            if (route.children) {
                children = createMenus(route.children);
            }

            const meta = route.meta;
            menus.push({
                text: meta && meta.text ? meta.text : route.name,
                icon: meta ? meta.icon : '',
                path: route.path,
                children
            })
        }
    });

    return menus

};

/**
 * 创建默认的顶部视图
 * @param routes 路由
 * @param filter 过滤器
 */
export const createDefaultVisitedBar = (routes, filter) => {
    if (filter) {
        routes.filter(i => filter(i));
    }
    let defaultVisitedItems = [];
    routes.forEach(route => {
        const meta = route.meta;
        if (meta && meta.defaultVisited) {
            defaultVisitedItems.push({
                name: meta && meta.text ? meta.text : route.name,
                path: route.path,
            })
        }
    });
    return defaultVisitedItems;
};
