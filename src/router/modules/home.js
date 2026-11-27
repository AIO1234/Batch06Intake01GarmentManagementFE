export default [
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/Login.vue"),
    meta: {
      pageTitle: "Login",
    },
  },
  {
    path: "/",
    redirect: "/dispatch",
  },
  {
    path: "/dashboard",
    component: () => import("@/layouts/default.vue"),
    children: [
      {
        path: "",
        name: "dashboard",
        component: () => import("@/views/AdminSide/Dashboard.vue"),
        meta: {
          pageTitle: "Dashboard",
        },
      },
    ],
  },
  {
    path: "/admin",
    component: () => import("@/layouts/default.vue"),
    children: [
      {
        path: "",
        redirect: "/admin/dashboard",
      },
      {
        path: "dashboard",
        name: "admin-dashboard",
        component: () => import("@/views/AdminSide/Dashboard.vue"),
        meta: {
          pageTitle: "Dashboard",
        },
      },
      // {
      //   path: "/admin/product-management",
      //   component: () =>
      //     import("@/views/AdminSide/Product Management/index.vue"),
      //   meta: {
      //     pageTitle: "Product Management",
      //   },
      // },
    ],
  },
];
