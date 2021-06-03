import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './permission';
import './styles/index.scss';
import './mock';
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
createApp(App).use(store).use(router).use(ElementPlus).mount('#app');
//# sourceMappingURL=main.js.map