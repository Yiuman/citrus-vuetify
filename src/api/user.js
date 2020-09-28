import request from "@/utils/request";

/**
 * 登录
 * @param data 登录的表单数据
 */
export const login = (data) => {
  return request.post("/rest/authenticate", data);
};

/**
 * 登出
 */
export const logout = () => {
  return request.post("/rest/logout");
};

/**
 * 获取个人信息
 */
export const getCurrentUser = () => {
  return request.get("/rest/users/current");
};

/**
 * 获取个人动态
 * @param {*} userId 用户ID
 */
export const getAccessLogsByUserId = (userId) => {
  return request.get("/rest/access/log", {
    params: {
      userId: userId,
      sortDesc: ["createTime"],
      pageSize: 5,
      resourceType: [0, 1, 2],
    },
  });
};

/**
 * 保存个人配置
 */
export const saveUserProfile = (data) => {
  return request.post("/rest/users/profile", data);
};

/**
 * 修改密码
 */
export const updatePassword = (data) => {
  return request.post("/rest/users/password", data);
};
