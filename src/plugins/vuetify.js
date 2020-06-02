import Vue from 'vue'
import Vuetify, {VSelect, VTextField} from 'vuetify/lib'
import TreeModel from '../components/TreeModel'
import TreeSelect from '../components/TreeSelect'
import '@mdi/font/css/materialdesignicons.css';

Vue.use(Vuetify, {
    components: {
        VSelect,
        VTextField,
        TreeModel,
        TreeSelect
    }
});
const opts = {
    icons: {
        iconfont: 'mdi',
    },
};

export default new Vuetify(opts)
