import request from "../utils/request";

/**
 * 获取数据范围列表
 */
export const getDataScopes = () => {
    return request.get("/rest/scopes");
};

/**
 * 获取菜单的操作集合
 * @param menuId 菜单ID
 */
export const getOperationByKey = (menuId) => {
    return request.get(`/rest/menus/operation/${menuId}`);
};
