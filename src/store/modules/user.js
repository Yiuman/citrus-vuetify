import {login} from '../../api/user'


const state = {
    token: '',
    name:'',
    roles:[],
};

const mutations = {
    SET_TOKEN: (state, token) => {
        state.token = token
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
                const {data} = response;
                commit('SET_TOKEN', data);
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
