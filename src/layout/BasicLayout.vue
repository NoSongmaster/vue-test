<template>
  <!-- 根据获取到的 navTheme 和navLayout 改变class 可以设置样式-->
  <div :class="[`nav-theme-${navTheme}`, `nav-layout-${navLayout}`]">
    <a-layout id="components-layout-demo-side" style="min-height: 100vh">
      <!-- 1. 只有当navLayout=left的时候才显示菜单 -->
      <!-- 2. theme 是Layout.Sider 自带的属性，设置主题颜色: light dark-->
      <!-- 3. collapsed是Layout.Sider 自带的属性 侧边栏收起状态, boolean 用v-model 接收 collapsed -->
      <a-layout-sider
        v-if="navLayout === 'left'"
        :theme="navTheme"
        :trigger="null"
        collapsible
        v-model="collapsed"
      >
        <div class="logo">
          Ant-Design-Vue
        </div>
        <SiderMenu />
      </a-layout-sider>
      <a-layout>
        <a-layout-header style="background: #fff; padding: 0">
          <!-- 点击图片触发修改collapsed, 并且根据collapsed的值修改图片样式 -->
          <a-icon
            @click="collapsed = !collapsed"
            class="trigger"
            :type="collapsed ? 'menu-unfold' : 'menu-fold'"
          ></a-icon>
          <Header />
        </a-layout-header>
        <a-layout-content style="margin: 0 16px">
          <router-view></router-view>
        </a-layout-content>
        <a-layout-footer style="text-align: center">
          <Footer />
        </a-layout-footer>
      </a-layout>
    </a-layout>
    <SettingDrawer />
  </div>
</template>

<script>
import Header from "./Header";
import Footer from "./Footer";
import SiderMenu from "./SiderMenu";
import SettingDrawer from "../components/SettingDrawer";

export default {
  data() {
    return {
      collapsed: false
    };
  },
  // 计算属性, 当 navTheme的值发生变化, 也要进行变化。 这个是从SettingDrawer/index.vue中data return出来的
  computed: {
    navTheme() {
      return this.$route.query.navTheme || "dark";
    },
    navLayout() {
      return this.$route.query.navLayout || "left";
    }
  },
  components: {
    Header,
    Footer,
    SiderMenu,
    SettingDrawer
  }
};
</script>

<style scoped>
/* 设置菜单伸缩图标的样式 */
.trigger {
  padding: 0 20px;
  line-height: 64px;
  font-size: 20px;
}
/* 设置 菜单缩放鼠标放置效果 */
.trigger:hover {
  background-color: beige;
}
/* Logo样式 */
.logo {
  height: 64px;
  line-height: 64px;
  text-align: center;
  overflow: hidden;
}
.nav-theme-dark >>> .logo {
  color: white;
}
</style>
