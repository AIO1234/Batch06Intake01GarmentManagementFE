export default [
  {
    path: "/admin",
    component: () => import("@/layouts/default.vue"),
    children: [
      {
        path: "/admin/orders",
        name: "admin-orders",
        component: () => import("@/views/AdminSide/OrderManagement/index.vue"),
        meta: {
          pageTitle: "Orders & Styles",
        },
      },
      {
        path: "/admin/order-status",
        name: "admin-order-status",
        component: () =>
          import("@/views/AdminSide/OrderManagement/OrderStatusReport.vue"),
        meta: {
          pageTitle: "Order Status",
        },
      },
    ],
  },
];
