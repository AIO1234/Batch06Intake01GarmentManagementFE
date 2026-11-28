/**
 * =========================================================================================
 * Garment Manufacturing ERP - Vue Router Configuration
 * File: src/router/index.js
 * Reference: UI Design Document Page 4 (Sidebar Menu & Route Map)
 * Purpose:
 *   - Assembles modular route definitions across all 11 ERP functions.
 *   - Configures HTML5 Web History mode with base URL resolution.
 *   - Enforces dynamic document title updates on each route change.
 *   - Defines catch-all fallback wildcard route redirecting to /dispatch.
 * =========================================================================================
 */

import Home from "./modules/home";
import Dispatch from "./modules/dispatch";
import GarmentRoutes from "./modules/garment_routes";
import Users from "./modules/users";

import { createRouter, createWebHistory } from "vue-router";

// Initialize Vue Router with aggregated module routes
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Staff authentication, landing dashboard, and root redirects
    ...Home,

    // Function 10: Dispatch Management routes (/dispatch, /admin/dispatch)
    ...Dispatch,

    // Functions 1-9 & 11: Customer, Order, Supplier, PO, BOM, GRN, Stock, Production, QA, Invoices
    ...GarmentRoutes,

    // Internal user administration routes (/admin/users)
    ...Users,

    // Fallback wildcard route redirecting unmatched URLs to Dispatch Management
    {
      path: "/:pathMatch(.*)*",
      redirect: "/dispatch",
    },
  ],
});

/**
 * Global Navigation Guard: updates browser tab title dynamically after each navigation
 */
router.afterEach((to) => {
  if (to.meta?.pageTitle) {
    document.title = `${to.meta.pageTitle} - Garment ERP`;
  }
});

export default router;
