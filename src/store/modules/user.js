import {getCurrentUser, login} from '../../api/user'
import storage from "../../utils/storage";

const state = {
    token: storage.get('token'),
    name: '',
    avatar: '',
    roles: [],
    userOnlineInfo: null
};

const mutations = {
    SET_TOKEN: (state, token) => {
        state.token = token;
        storage.save("token", token);
    },
    SET_INTRODUCTION: (state, introduction) => {
        state.introduction = introduction
    },
    SET_NAME: (state, name) => {
        state.name = name
    },
    SET_AVATAR: (state, avatar) => {
        state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
        state.roles = roles
    },
    SET_USER_ONLINE_INFO: (state, userOnlineInfo) => {
        state.userOnlineInfo = userOnlineInfo;
    }
};

const actions = {
    // user login
    login({commit}, loginModel) {
        return new Promise((resolve, reject) => {
            login(loginModel).then(response => {
                commit('SET_TOKEN', response.token);
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },
    getCurrent({commit}) {
        return new Promise(((resolve, reject) => {
            getCurrentUser().then(user => {
                commit('SET_NAME', user.username);
                commit('SET_AVATAR', user.avatar);
                commit('SET_USER_ONLINE_INFO', user);
                resolve();
            }).catch(reason => {
                reject(reason);
            })
        }))
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
