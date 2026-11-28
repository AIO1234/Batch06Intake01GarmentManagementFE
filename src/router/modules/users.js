/**
 * =========================================================================================
 * Garment Manufacturing ERP - Internal User Administration Route Module
 * File: src/router/modules/users.js
 * Purpose:
 *   - Configures route definitions for internal user management (/admin/users).
 *   - Allows administrators to manage system staff accounts and permissions.
 * =========================================================================================
 */

export default [
  {
    path: "/admin",
    component: () => import("@/layouts/default.vue"),
    children: [
      {
        path: "users",
        name: "admin-users",
        component: () => import("@/views/AdminSide/UserManagement/index.vue"),
        meta: {
          pageTitle: "User Management",
        },
      },
    ],
  },
];
