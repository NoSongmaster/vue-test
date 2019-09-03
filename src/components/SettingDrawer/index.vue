<template>
  <div>
    <!-- visible设置是否可见 -->
    <a-drawer
      title="Basic Drawer"
      placement="right"
      :closable="false"
      @close="onClose"
      :visible="visible"
      with="300px"
    >
      <!-- handle	设置后抽屉直接挂载到DOM上，你可以通过该handle控制抽屉打开关闭	VNode | slot	- -->
      <template v-slot:handle>
        <div class="handle" @click="visible = !visible">
          <a-icon :type="visible ? 'close' : 'setting'"></a-icon>
        </div>
      </template>
      <div>
        <!--a-radio-group从$route.query.navTheme获取value的值，未获取到:默认为dark -->
        <!-- @change  -->
        <a-radio-group
          :value="$route.query.navTheme || 'dark'"
          @change="e => handleSettingChange('navTheme', e.target.value)"
        >
          <h2>整体风格定制</h2>
          <!-- 两个选项-value:dark\light  根据 a-radio-group 的value选中-->
          <a-radio value="dark">黑色</a-radio>
          <a-radio value="light">白色</a-radio>
        </a-radio-group>
        <!-- 跟上方相同 -->
        <a-radio-group
          :value="$route.query.navLayout || 'left'"
          @change="e => handleSettingChange('navLayout', e.target.value)"
        >
          <h2>导航模式</h2>
          <a-radio value="left">左侧</a-radio>
          <a-radio value="top">顶部</a-radio>
        </a-radio-group>
      </div>
    </a-drawer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      // 定义整体风格
      navTheme: "dark",
      // 定义导航模式
      navLayout: "left"
    };
  },

  methods: {
    onClose() {
      this.visible = false;
    },
    handleSettingChange(type, value) {
      // ?navTheme=dark&navLayout=left 在路由中体现
      // 将数据保存到路由信息中，query 中保存信息 ， query中原来的值: ...this.$route.query, 新增的值[type]: value
      this.$router.push({ query: { ...this.$route.query, [type]: value } });
    }
  }
};
</script>

<style scoped>
/* scoped 只在当前的vue中生效的 style */
/* drawer 设置样式 */
.handle {
  position: absolute;
  top: 200px;
  right: 255px;
  width: 48px;
  height: 48px;
  background-color: green;
  color: white;
  font-size: 20px;
  text-align: center;
  line-height: 48px;
  border-radius: 10px 0 0 10px;
}
</style>
