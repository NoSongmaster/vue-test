import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
// 导入方式1
// 导入ant-design-vue组件 名称为Antd
// import Antd from "ant-design-vue";
// 导入样式
// import "ant-design-vue/dist/antd.css";
// 导入less样式需要开启JavaScript: 创建vue.config.js
// 参考https://cli.vuejs.org/zh/guide/css.html#%E5%90%91%E9%A2%84%E5%A4%84%E7%90%86%E5%99%A8-loader-%E4%BC%A0%E9%80%92%E9%80%89%E9%A1%B9
// import "ant-design-vue/dist/antd.less";
// 导入方式2: 使用babel按需导入
import { Button } from "ant-design-vue";

Vue.config.productionTip = false;
// Vue中使用 Antd
Vue.use(Button);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
