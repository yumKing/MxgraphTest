import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './router-intercept';

import customConfig from './config/index';
// import './mock';
import './styles/index.scss';

import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';

const app = createApp(App);
customConfig(app);
app.use(store).use(router).use(ElementPlus).mount('#app');
