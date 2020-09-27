import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import "./styles/index.styl";

import moment from "moment"; //导入文件
moment.locale("zh-cn"); //需要汉化
Vue.prototype.$moment = moment; //赋值使用


import Toasted from 'vue-toasted';
Vue.use(Toasted, {
    duration:2000,
    iconPack:'mdi',
    fitToScreen:true,
})

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
