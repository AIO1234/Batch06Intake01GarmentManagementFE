export default [
  {
    path: "/dispatch",
    component: () => import("@/layouts/default.vue"),
    children: [
      {
        path: "",
        name: "dispatch-management",
        component: () => import("@/views/AdminSide/Dispatch Management/index.vue"),
        meta: {
          pageTitle: "Dispatches",
          section: "Dispatch Management",
        },
      },
      {
        path: "summary",
        name: "dispatch-summary",
        component: () => import("@/views/AdminSide/Dispatch Management/index.vue"),
        meta: {
          pageTitle: "Dispatch Summary",
          section: "Dispatch Management",
        },
      },
    ],
  },
  {
    path: "/admin/dispatch",
    component: () => import("@/layouts/default.vue"),
    children: [
      {
        path: "",
        name: "admin-dispatch-management",
        component: () => import("@/views/AdminSide/Dispatch Management/index.vue"),
        meta: {
          pageTitle: "Dispatches",
          section: "Dispatch Management",
        },
      },
    ],
  },
];
