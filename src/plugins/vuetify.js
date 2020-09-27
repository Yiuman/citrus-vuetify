import Vue from "vue";
import Vuetify, {  VBtn, VIcon,VSelect,VTextField } from "vuetify/lib";
import TreeModel from "../components/TreeModel";
import TreeSelect from "../components/TreeSelect";
import "@mdi/font/css/materialdesignicons.css";
Vue.use(Vuetify, {
  components: {
    VSelect,
    VTextField,
    TreeModel,
    TreeSelect,
    VBtn,
    VIcon
  },
});
const opts = {
  icons: {
    iconfont: "mdi",
  },
  //主题样式
  theme: {
    themes: {
      light: {
        // primary: '#9fa8da',
        primary: "#80abfa",
        // primary: "#4777c9",
        // primary: '#80abfa',
      },
    },
  },
};
const vuetify = new Vuetify(opts);
export default vuetify;
