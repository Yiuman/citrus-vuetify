import {login} from '../../api/user'
import storage from "../../utils/storage";

const state = {
    token: storage.get('token'),
    name: '',
    roles: [],
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
};

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
