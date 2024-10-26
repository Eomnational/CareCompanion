import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router/index.js';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import panelHead from './components/panelHead.vue';

const app = createApp(App);

// 加载全部图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}

// 注册全局组件  这样全局可以调用
app.component('panelHead', panelHead);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(pinia);
app.use(router);
app.mount('#app');
