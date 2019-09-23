import Vue from "vue";
import Router from "vue-router";
import findLast from "lodash/findLast";
import NotFound from "./views/404";
import Forbidden from "./views/403";
import NProgress from "nprogress";
import { notification } from "ant-design-vue";
import "nprogress/nprogress.css";
import { check, isLogin } from "./utils/auth";
// import Home from "./views/Home.vue";
// import RenderRouterView from "./components/RenderRouterView";
Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/user",
      // 在routes中，有name字段的路由才会在菜单中显示, 加上hideInMenu字段在生成数据的时候会自动的过滤掉
      hideInMenu: true,
      // 方式一: 我们需要给他绑定组件: 通过  <router-view></router-view> 才能展示
      // component: RenderRouterView,
      // 方式二: 通过render渲染router-view 实现显示
      // component: { render: h => h("router-view") },
      // 方式三: 异步加载,
      component: () =>
        import(/* webpackChunkName: "user" */ "./layout/UserLayout"),
      children: [
        // 当访问/user 重定向到/user/login
        { path: "/user/", redirect: "/user/login" },
        {
          path: "/user/login",
          name: "login",
          // 异步加载
          component: () =>
            import(/* webpackChunkName: "user" */ "./views/User/Login")
        },
        {
          path: "/user/register",
          name: "register",
          component: () =>
            import(/* webpackChunkName: "user" */ "./views/User/Register")
        }
      ]
    },
    {
      // 层级嵌套:
      // 首先是/地址
      path: "/",
      // 设置可以通过访问的用户角色权限
      meta: { authority: ["user", "admin"] },
      // 进行导入了 ./layout/BasicLayout.vue 这部分渲染代码就留到了页面上。
      component: () =>
        import(/* webpackChunkName: "user" */ "./layout/BasicLayout"),
      // 再查看/ 下的子地址
      children: [
        // 如果匹配到/ 地址就跳转到 /dashboard/analysis
        {
          path: "/",
          redirect: "/dashboard/analysis"
        },
        // Dashboard
        {
          // 到/dashboard地址
          path: "/dashboard",
          name: "dashboard",
          // 设置meta属性，icon图表，title
          meta: { icon: "dashboard", title: "仪表盘" },
          // 直接渲染router-view.这个代表着父级路由的渲染代码，不进行任何渲染和修改.留在页面上
          component: { render: h => h("router-view") },
          // /dashboard的子地址
          children: [
            {
              path: "/dashboard/analysis",
              name: "analysis",
              // 我们只在一级菜单中显示图标，子菜单中只显示title
              meta: { title: "分析页" },
              // 导入 ./views/Dashboard/Analysis.vue 进行渲染。父级留下来的代码里存在<router-view></router-view>
              // 所以 这里子地址中渲染的代码直接嵌套在<router-view>内
              component: () =>
                import(
                  /* webpackChunkName: "dashboard" */ "./views/Dashboard/Analysis"
                )
            }
          ]
        },
        // Form
        {
          path: "/form",
          name: "form",
          component: { render: h => h("router-view") },
          // 在form表单中只允许admin可以访问
          meta: { icon: "form", title: "表单", authority: ["admin"] },
          children: [
            {
              path: "/form/basic-form",
              name: "basicform",
              meta: { title: "基础表单" },
              component: () =>
                import(/* webpackChunkName: "form" */ "./views/Forms/BasicForm")
            },
            {
              path: "/form/step-form",
              name: "stepform",
              // 隐藏children里的子路由
              hideChildrenInMenu: true,
              meta: { title: "分布表单" },
              component: () =>
                // 如果 import是一个目录。默认 import StepForm/index.vue
                import(/* webpackChunkName: "form" */ "./views/Forms/StepForm"),
              children: [
                {
                  path: "/form/step-form",
                  redirect: "/form/step-form/info"
                },
                {
                  path: "/form/step-form/info",
                  name: "info",
                  component: () =>
                    import(
                      /* webpackChunkName: "form" */ "./views/Forms/StepForm/Step1"
                    )
                },
                {
                  path: "/form/step-form/confirm",
                  name: "confirm",
                  component: () =>
                    import(
                      /* webpackChunkName: "form" */ "./views/Forms/StepForm/Step2"
                    )
                },
                {
                  path: "/form/step-form/result",
                  name: "result",
                  component: () =>
                    import(
                      /* webpackChunkName: "form" */ "./views/Forms/StepForm/Step3"
                    )
                }
              ]
            }
          ]
        }
      ]
    },
    //
    {
      path: "/403",
      name: "403",
      hideInMenu: true,
      component: Forbidden
    },
    {
      path: "*",
      name: "404",
      hideInMenu: true,
      component: NotFound
    }
  ]
});
// 页面加载进度条
router.beforeEach((to, from, next) => {
  // 如果操作是在当前页面。不进行NProgress
  if (to.path !== from.path) {
    NProgress.start();
  }
  console.log(record);
  console.log(to.matched);
  // 找到离 跳转记录 最近的 meta 设置authority 字段的记录
  // 从当前要 跳转的地址 to.matched 是一个列表 里面保存的是字典对象 范例填写: ["/", "/dashboard", "/dashboad/analysis"]
  // findLast([1,2,3,4,5], function(n))  这个匿名函数 为 找到 n 中 n.meta.authority有值 的这条数据进行返回
  const record = findLast(to.matched, record => record.meta.authority);
  // 此处record 就是一个 url可以跳转的路径。但我们需要判断的是这个路径允许通过的 authority 是什么
  console.log(record);
  // 判断当前用户是否可以查看路径下的内容、如果不可以查看
  if (record && !check(record.meta.authority)) {
    if (!isLogin && to.path !== "/user/login") {
      next({
        path: "/user/login"
      });
    } else if (to.path !== "/403") {
      // 右上角错误提示信息，
      notification.error({
        message: "403",
        description: "你没有权限访问， 请联系管理员咨询"
      });
      next({ path: "/403" });
    }
    NProgress.done();
  }
  next();
});

router.afterEach(() => {
  NProgress.done();
});
export default router;
