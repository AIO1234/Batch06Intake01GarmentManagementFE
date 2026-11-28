/**
 * =========================================================================================
 * Garment Manufacturing ERP - Authentication & Dashboard Route Module
 * File: src/router/modules/home.js
 * Reference: UI Design Document Page 3 (Login & Landing Dashboard Screens)
 * Purpose:
 *   - Configures route definitions for internal staff authentication (/login).
 *   - Configures the central landing Dashboard (/dashboard, /admin/dashboard).
 *   - Establishes root path redirect (/) directing users to the dispatch system.
 * =========================================================================================
 */

export default [
  // Internal Staff Login Screen (Page 3)
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/Login.vue"),
    meta: {
      pageTitle: "Login",
    },
  },

  // Root path: redirects directly to Dispatch Management
  {
    path: "/",
    redirect: "/dispatch",
  },

  // Standard Dashboard Landing Route: /dashboard
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

  // Admin Prefix Alias: /admin and /admin/dashboard
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
    ],
  },
];
