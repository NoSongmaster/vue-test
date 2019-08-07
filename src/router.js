import Vue from "vue";
import Router from "vue-router";
import NotFound from "./views/404";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
// import Home from "./views/Home.vue";
// import RenderRouterView from "./components/RenderRouterView";
Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/user",
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
          // 直接渲染router-view. 这个代表着父级路由的渲染代码，不进行任何渲染和修改.留在页面上
          component: { render: h => h("router-view") },
          // /dashboard的子地址
          children: [
            {
              path: "/dashboard/analysis",
              name: "analysis",
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
          children: [
            {
              path: "/form/basic-form",
              name: "basicform",
              component: () =>
                import(/* webpackChunkName: "form" */ "./views/Forms/BasicForm")
            },
            {
              path: "/form/step-form",
              name: "stepform",
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

    {
      path: "*",
      name: "404",
      component: NotFound
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/About.vue")
    }
  ]
});

router.beforeEach((to, from, next) => {
  NProgress.start();
  next();
});

router.afterEach(() => {
  NProgress.done();
});
export default router;
