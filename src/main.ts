import Vue from 'vue';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import App from './App.vue';
import { createPinia, PiniaVuePlugin } from 'pinia';
import router from './router';
const pinia = createPinia();

Vue.use(Antd);
Vue.use(PiniaVuePlugin);

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
  pinia,
}).$mount('#app');
