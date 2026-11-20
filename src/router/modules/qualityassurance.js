export default [
  // default layout route
  {
    path: "/admin",
    component: import("@/layouts/default.vue"),
    children: [
      // quality assurance route
      {
        path: "/admin/quality-assurance",
        component: import("@/views/AdminSide/QualityAssurance/index.vue"),
        meta: {
          pageTitle: "Quality Assurance",
        },
      },
    ],
  },
];
