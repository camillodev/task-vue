import Vue from 'vue';
import App from './App.vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

// Add all solid icons to the library
library.add(fas);

Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.use(Antd);
Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount('#app');
