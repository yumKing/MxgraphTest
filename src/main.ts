import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import "./styles/index.scss";
import ElementPlus from 'element-plus'

import Chat from "jwchat";
import "jwchat/lib/JwChat.css";

createApp(App).use(store).use(router).use(ElementPlus).mount("#app");
