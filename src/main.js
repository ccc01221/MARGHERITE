import Vue from 'vue'
import App from './app/ui/App.vue'
import router from './app/router'
import store from './app/store'
import SimpleVueValidation from 'simple-vue-validator';
import axios from 'axios'
import Toasted from 'vue-toasted';
import { i18n } from './plugins/i18n'
import { VLazyImagePlugin } from "v-lazy-image";
import LoadScript from 'vue-plugin-load-script';
Vue.use(LoadScript);
Vue.use(VLazyImagePlugin);
import VueSession from 'vue-session'

const moment = require('moment');
require('moment/locale/de');

Vue.use(require('vue-moment'), {
    moment
})
import { VueMasonryPlugin } from 'vue-masonry';
import VScrollLock from 'v-scroll-lock'

Vue.use(VueMasonryPlugin);
Vue.use(Toasted);
Vue.use(VScrollLock);
Vue.use(VueSession);

Vue.config.productionTip = false;
Vue.use(SimpleVueValidation);
Vue.prototype.$http = axios

new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
}).$mount('#app')