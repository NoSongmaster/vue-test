<template>
  <!-- 模板引用: https://vue.ant.design/components/menu-cn/#%E5%8D%95%E6%96%87%E4%BB%B6%E9%80%92%E5%BD%92%E8%8F%9C%E5%8D%95 -->
  <div style="width: 256px">
    <!-- defaultSelectedKeys和 defaultOpenKeys是菜单打开状态 -->
    <!-- 强相关的 -->
    <a-menu
      :selectedKeys="selectedKeys"
      :openKeys.sync="openKeys"
      mode="inline"
      :theme="theme"
    >
      <!-- 根据menuData 修改生成的菜单 -->
      <template v-for="item in menuData">
        <!-- 点击进行切换路由路径。实现页面跳转。 query代表了代表了？后面的参数信息 -->
        <a-menu-item
          v-if="!item.children"
          :key="item.path"
          @click="() => $router.push({ path: item.path, query: $route.query })"
        >
          <!-- 根据meta 进行icon选择 -->
          <a-icon v-if="item.meta.icon" :type="item.meta.icon" />
          <span>{{ item.meta.title }}</span>
        </a-menu-item>
        <!-- sub-menu 中传入 menu-info=item -->
        <sub-menu v-else :menu-info="item" :key="item.path" />
      </template>
    </a-menu>
  </div>
</template>

<script>
/* 有两种组件选择方式 1. 函数式组件SubMenu.vue   2.普通组件SubMenu1.vue
 * recommend SubMenu.vue https://github.com/vueComponent/ant-design-vue/blob/master/components/menu/demo/SubMenu.vue
 * SubMenu1.vue https://github.com/vueComponent/ant-design-vue/blob/master/components/menu/demo/SubMenu1.vue
 * */
import SubMenu from "./SubMenu";
export default {
  // 用于接收父级vue传入参数
  props: {
    // theme 为整体风格样式
    theme: {
      type: String,
      default: "dark"
    }
  },

  components: {
    "sub-menu": SubMenu
  },
  data() {
    // 用于菜单栏选择信息保存，1. select 选择的Key open 打开的key
    this.selectedKeysMap = {};
    this.openKeysMap = {};
    const menuData = this.getMenuData(this.$router.options.routes);
    return {
      collapsed: false,
      // list是菜单数据
      list: [],
      menuData,
      selectedKeys: this.selectedKeysMap[this.$route.path],
      openKeys: this.openKeysMap[this.$route.path]
    };
  },

  watch: {
    // 检测$route.path 发生变化。
    "$route.path": function(val) {
      this.selectedKeys = this.selectedKeysMap[val];
      this.openKeys = this.collapsed ? [] : this.openKeysMap[val];
    }
  },

  methods: {
    toggleCollapsed() {
      this.collapsed = !this.collapsed;
    },
    // 获取菜单数据函数， parentKeys，selectedKeys 选中
    getMenuData(routers = [], parentKeys = [], selectedKeys) {
      // console.log(routers);
      // 定义一个菜单信息
      const menuData = [];
      // 循环传入的routers信息
      routers.forEach(item => {
        // 如果item存在名字，并且没有被隐藏
        if (item.name && !item.hideInMenu) {
          // 保存到打开Map中
          this.openKeysMap[item.path] = parentKeys;
          // 保存选中的key
          this.selectedKeysMap[item.path] = [selectedKeys || item.path];
          // vue 中字典类型赋值: 将item 的信息保存到newitem中
          const newitem = { ...item };
          // 删除 字典中的key: children 字段
          delete newitem.children;
          // collapsed是打开的(一级菜单是打开状态-需要处理子菜单) && 子菜单没有隐藏
          if (item.children && !item.hideChildrenInMenu) {
            // 通过递归函数-再次获取 菜单列表信息-保存到newitem 的cildren里
            newitem.children = this.getMenuData(item.children, [
              ...parentKeys,
              item.path
            ]);
            // 其他情况-
          } else {
            this.getMenuData(
              item.children,
              selectedKeys ? parentKeys : [...parentKeys, item.path],
              selectedKeys || item.path
            );
          }
          // 将菜单信息存到列表里
          menuData.push(newitem);
          // 或者: item没隐藏 - item的子菜单没隐藏 - 并且存在子菜单
        } else if (
          !item.hideInMenu &&
          !item.hideChildrenInMenu &&
          item.children
        ) {
          // 递归处理 - 获取菜单信息- 保存到menuData中
          menuData.push(...this.getMenuData(item.children));
        }
      });
      return menuData;
    }
  }
};
</script>
