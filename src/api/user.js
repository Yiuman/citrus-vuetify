import request from "../utils/request";

/**
 * 登录
 * @param data 登录的表单数据
 */
export const login = (data) => {
    return request.post('/rest/authenticate',data);
};

export const getCurrentUser= ()=>{
    return request.get("/rest/users/current");
};


