import Vue from 'vue';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import App from './App.vue';
import { createPinia, PiniaVuePlugin } from 'pinia';
const pinia = createPinia();

Vue.use(Antd);
Vue.use(PiniaVuePlugin);

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
  pinia,
}).$mount('#app');
