export default [
  {
    path: "/customers",
    component: () => import("@/layouts/default.vue"),
    children: [
      {
        path: "",
        name: "customers",
        component: () => import("@/views/AdminSide/ModulePlaceholder.vue"),
        meta: { pageTitle: "Customers", report: "Customer List" },
      },
    ],
  },
  {
    path: "/orders",
    component: () => import("@/layouts/default.vue"),
    children: [
      {
        path: "",
        name: "orders",
        component: () => import("@/views/AdminSide/ModulePlaceholder.vue"),
        meta: { pageTitle: "Orders & Styles", report: "Order Status" },
      },
    ],
  },
  {
    path: "/suppliers",
    component: () => import("@/layouts/default.vue"),
    children: [
      {
        path: "",
        name: "suppliers",
        component: () => import("@/views/AdminSide/ModulePlaceholder.vue"),
        meta: { pageTitle: "Suppliers", report: "Supplier List" },
      },
    ],
  },
  {
    path: "/purchase-orders",
    component: () => import("@/layouts/default.vue"),
    children: [
      {
        path: "",
        name: "purchase-orders",
        component: () => import("@/views/AdminSide/ModulePlaceholder.vue"),
        meta: { pageTitle: "Purchase Orders", report: "PO Status" },
      },
    ],
  },
  {
    path: "/materials-bom",
    component: () => import("@/layouts/default.vue"),
    children: [
      {
        path: "",
        name: "materials-bom",
        component: () => import("@/views/AdminSide/ModulePlaceholder.vue"),
        meta: { pageTitle: "Materials & BOM", report: "Material Requirement" },
      },
    ],
  },
  {
    path: "/grn",
    component: () => import("@/layouts/default.vue"),
    children: [
      {
        path: "",
        name: "grn",
        component: () => import("@/views/AdminSide/ModulePlaceholder.vue"),
        meta: { pageTitle: "Goods Receipt", report: "GRN Report" },
      },
    ],
  },
  {
    path: "/stock",
    component: () => import("@/layouts/default.vue"),
    children: [
      {
        path: "",
        name: "stock",
        component: () => import("@/views/AdminSide/ModulePlaceholder.vue"),
        meta: { pageTitle: "Raw Material Stock", report: "Stock Balance" },
      },
    ],
  },
  {
    path: "/production",
    component: () => import("@/layouts/default.vue"),
    children: [
      {
        path: "",
        name: "production",
        component: () => import("@/views/AdminSide/ModulePlaceholder.vue"),
        meta: { pageTitle: "Production", report: "Daily Production" },
      },
    ],
  },
  {
    path: "/qa",
    component: () => import("@/layouts/default.vue"),
    children: [
      {
        path: "",
        name: "qa",
        component: () => import("@/views/AdminSide/ModulePlaceholder.vue"),
        meta: { pageTitle: "Quality Assurance", report: "QA Inspection" },
      },
    ],
  },
  {
    path: "/invoices",
    component: () => import("@/layouts/default.vue"),
    children: [
      {
        path: "",
        name: "invoices",
        component: () => import("@/views/AdminSide/ModulePlaceholder.vue"),
        meta: { pageTitle: "Invoicing", report: "Sales Invoice" },
      },
    ],
  },
];
