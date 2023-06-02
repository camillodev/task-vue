import Vue from 'vue';
import VueRouter from 'vue-router';
import TemplateManager from './components/CheckList/TemplateManager.vue';
import DescriptionField from './components/DescriptionField.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: DescriptionField,
  },
  {
    path: '/template-manager',
    name: 'template-manager',
    component: TemplateManager,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
