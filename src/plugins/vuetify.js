import Vue from 'vue'
import Vuetify, {VSelect, VTextField} from 'vuetify/lib'
import '@mdi/font/css/materialdesignicons.css';

Vue.use(Vuetify, {
    components: {
        VSelect,
        VTextField
    }
});
const opts = {
    icons: {
        iconfont: 'mdi',
    },
};

export default new Vuetify(opts)
