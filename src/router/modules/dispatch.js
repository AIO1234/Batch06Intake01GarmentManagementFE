/**
 * =========================================================================================
 * Function 10: Dispatch Management - Route Module
 * File: src/router/modules/dispatch.js
 * Reference: UI Design Document Page 4 (#10 Dispatch -> /dispatch)
 * Student: Student 10 Deliverable
 * Purpose:
 *   - Configures URL routes for the Dispatch Management section.
 *   - Maps /dispatch and /admin/dispatch to the DispatchManagement view component.
 *   - Sets route metadata including pageTitle used by the top header bar and browser title.
 * =========================================================================================
 */

export default [
  // Primary Dispatch Management Route: /dispatch
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

  // Admin Prefix Alias: /admin/dispatch
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
