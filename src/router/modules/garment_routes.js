/**
 * =========================================================================================
 * Garment Manufacturing ERP - Shared Function Routes Module
 * File: src/router/modules/garment_routes.js
 * Reference: UI Design Document Page 4 (Fixed Navigation Map & Routes Table)
 * Purpose:
 *   - Defines standard routing for the remaining functions in the Garment ERP system:
 *       Fn 1: Customers         -> /customers
 *       Fn 2: Orders & Styles   -> /orders
 *       Fn 3: Suppliers         -> /suppliers
 *       Fn 4: Purchase Orders   -> /purchase-orders
 *       Fn 5: Materials & BOM   -> /materials-bom
 *       Fn 6: Goods Receipt     -> /grn
 *       Fn 7: Raw Material Stock-> /stock
 *       Fn 8: Production        -> /production
 *       Fn 9: Quality Assurance -> /qa
 *       Fn 11: Invoicing        -> /invoices
 *   - Enables full sidebar navigation across all functions in the shared prototype.
 * =========================================================================================
 */

export default [
  // Function 1: Customer Management
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

  // Function 2: Order Management & Garment Styles
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

  // Function 3: Supplier Management
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

  // Function 4: Purchase Orders
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

  // Function 5: Materials & Bill of Materials (BOM)
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

  // Function 6: Goods Receipt Notes (GRN)
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

  // Function 7: Raw Material Stock & Inventory
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

  // Function 8: Production Management
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

  // Function 9: Quality Assurance (QA)
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

  // Function 11: Invoicing Management
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
