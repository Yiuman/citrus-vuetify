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
    //主题样式
    theme: {
        themes: {
            light: {
                primary: '#80abfa',
                // primary: '#80abfa',
            }
        }
    }
};

export default new Vuetify(opts)
