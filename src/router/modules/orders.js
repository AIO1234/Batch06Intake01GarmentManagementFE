// Route definitions for Function 2: Order Management (Orders & Styles + Order Status Report)
export default [
  // Direct top-level route for Orders & Styles
  {
    path: "/OrderManagement",
    component: () => import("@/layouts/default.vue"),
    children: [
      {
        path: "",
        name: "order-management",
        component: () => import("@/views/AdminSide/OrderManagement/index.vue"),
        meta: {
          pageTitle: "Orders & Styles",
        },
      },
    ],
  },
  // Direct top-level route for Order Status Report
  {
    path: "/OrderStatus",
    component: () => import("@/layouts/default.vue"),
    children: [
      {
        path: "",
        name: "order-status-report",
        component: () =>
          import("@/views/AdminSide/OrderManagement/OrderStatusReport.vue"),
        meta: {
          pageTitle: "Order Status",
        },
      },
    ],
  },
  // Admin-prefixed routes used by sidebar navigation
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
