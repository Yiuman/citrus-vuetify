const state = {
  //动态添加的视图栏
  visitedItems: [],
};

const mutations = {
  ADD_VISITED_ITEM: (state, item) => {
    if (state.visitedItems.some((v) => v.path === item.path)) {
      return;
    }
    state.visitedItems.push(item);
  },
  REMOVE_VISITED_ITEM: (state, item) => {
    for (const [i, v] of state.visitedItems.entries()) {
      if (v.path === item.path) {
        state.visitedItems.splice(i, 1);
        break;
      }
    }
  },
  REMOVE_ALL_ITEMS(state) {
    state.visitedItems = [];
  },
  REPLACE_ITEMS(state, items) {
    state.visitedItems = items;
  },
};

const actions = {
  addItem({ commit }, item) {
    commit("ADD_VISITED_ITEM", item);
  },
  removeItem({ commit }, item) {
    commit("REMOVE_VISITED_ITEM", item);
  },

  removeAll({ commit }) {
    commit("REMOVE_ALL_ITEMS");
  },

  replaceItems({ commit }, items) {
    commit("REPLACE_ITEMS", items);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
