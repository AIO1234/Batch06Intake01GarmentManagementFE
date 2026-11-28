<!-- =========================================================================================
  Garment Manufacturing ERP - Shared Sidebar Navigation Component
  File: src/components/SideBar.vue
  Reference: UI Design Document Page 4 (Navigation Map & Shared Sidebar Menu)
  Purpose:
    - Provides a fixed navigation sidebar across all 11 ERP functions.
    - Standardized names and routes agreed upon in Week 1 so every student's screen sits
      in the exact same location in the UI.
    - Dark slate head/background (#12303b) with active item highlighted in teal (#0e7490).
========================================================================================== -->

<template>
  <aside class="erp-sidebar">
    <!-- ===================================================================================
         SIDEBAR BRAND HEADER
         Garment ERP title and system version notice
    ==================================================================================== -->
    <div class="sidebar-brand">
      <div class="brand-title">
        <span class="brand-dot"></span>
        GARMENT ERP
      </div>
      <div class="brand-sub">Manufacturing System v1.4</div>
    </div>

    <!-- ===================================================================================
         FIXED NAVIGATION MENU (11 FUNCTIONS + DASHBOARD)
         Strictly follows the business process flow (SRS §7):
         Customer ➔ Order ➔ BOM/PO ➔ GRN ➔ Stock ➔ Production ➔ QA ➔ Dispatch ➔ Invoice
    ==================================================================================== -->
    <ul class="sidebar-menu">
      <li
        v-for="item in menuItems"
        :key="item.route"
        class="nav-item"
      >
        <router-link
          :to="item.route"
          class="nav-link"
          :class="{ active: isRouteActive(item.route) }"
        >
          <!-- Function Sequence Number (1 to 11) or Navigation Bullet -->
          <span v-if="item.num" class="nav-num">{{ item.num }}</span>
          <span v-else class="nav-num">▸</span>
          <!-- Function Title -->
          <span class="nav-label">{{ item.label }}</span>
        </router-link>
      </li>
    </ul>

    <!-- ===================================================================================
         SIDEBAR FOOTER
         Course and SRS milestone identification
    ==================================================================================== -->
    <div class="sidebar-footer">
      <span>Student Project · SRS v1.4</span>
    </div>
  </aside>
</template>

<script>
export default {
  name: "SideBar",

  data() {
    return {
      /**
       * Standardized 11 Functions + Landing Dashboard Menu
       * Matching Page 4 Sidebar Navigation Map:
       */
      menuItems: [
        { label: "Dashboard", route: "/dashboard", num: "" },
        { label: "Customers", route: "/customers", num: "1" },
        { label: "Orders & Styles", route: "/orders", num: "2" },
        { label: "Suppliers", route: "/suppliers", num: "3" },
        { label: "Purchase Orders", route: "/purchase-orders", num: "4" },
        { label: "Materials & BOM", route: "/materials-bom", num: "5" },
        { label: "Goods Receipt", route: "/grn", num: "6" },
        { label: "Raw Material Stock", route: "/stock", num: "7" },
        { label: "Production", route: "/production", num: "8" },
        { label: "Quality Assurance", route: "/qa", num: "9" },
        { label: "Dispatch", route: "/dispatch", num: "10" }, // Student 10 module
        { label: "Invoicing", route: "/invoices", num: "11" },
      ],
    };
  },

  methods: {
    /**
     * Determines whether the given route is currently active
     * Handles root aliases, sub-routes, and admin path prefixes
     * @param {String} routePath - Menu item route
     * @returns {Boolean} True if route is currently selected
     */
    isRouteActive(routePath) {
      // Highlight Dispatch for both /dispatch and /admin/dispatch paths
      if (routePath === "/dispatch") {
        return (
          this.$route.path === "/dispatch" ||
          this.$route.path.startsWith("/admin/dispatch")
        );
      }
      // Highlight Dashboard for root, /dashboard, and /admin/dashboard
      if (routePath === "/dashboard") {
        return (
          this.$route.path === "/dashboard" ||
          this.$route.path === "/admin/dashboard" ||
          this.$route.path === "/admin"
        );
      }
      return this.$route.path === routePath;
    },
  },
};
</script>
