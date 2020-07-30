const state = {
    menus: [],
    inited: false,
};

const mutations = {
    ADD_ROUTERS(state, routers) {
        state.menus = [...state.menus, ...routers];
    }
};

const actions = {
    addRouters({commit}, routers) {
        commit('ADD_ROUTERS', routers);
    }
};


export default {
    namespace: true,
    state,
    mutations,
    actions
}
