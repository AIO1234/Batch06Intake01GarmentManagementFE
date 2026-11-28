<!-- =========================================================================================
  Garment Manufacturing ERP - Top Header / Horizontal Bar Component
  File: src/components/HorizantalBar.vue
  Reference: UI Design Document (Shared Screens & Header Specifications)
  Purpose:
    - Displays the active screen's title dynamically based on route metadata.
    - Presents the authenticated user identity ("Nimal P."), active role badge ("Administrator"),
      and a functional sign-out action button.
========================================================================================== -->

<template>
  <header class="erp-topbar">
    <!-- ===================================================================================
         LEFT: ACTIVE PAGE TITLE
         Dynamically read from route meta (e.g. "Dispatches", "Dashboard", "Orders & Styles")
    ==================================================================================== -->
    <div class="topbar-left">
      <h1 class="topbar-page-title">{{ displayTitle }}</h1>
    </div>

    <!-- ===================================================================================
         RIGHT: USER IDENTITY, ROLE BADGE & LOGOUT ACTION
         Matches wireframe top right status across all 11 function screens
    ==================================================================================== -->
    <div class="topbar-right">
      <!-- User Display Name -->
      <span class="user-name">Nimal P.</span>

      <!-- Role Badge (Administrator) -->
      <span class="user-role-badge">Administrator</span>

      <!-- Sign Out Button -->
      <button class="logout-btn" @click="handleLogout" title="Sign out of ERP">
        <span>⎋</span> Logout
      </button>
    </div>
  </header>
</template>

<script>
export default {
  name: "HorizantalBar",

  computed: {
    /**
     * Resolves the current page title from Vue Router route metadata
     * @returns {String} Page title or default ERP header
     */
    displayTitle() {
      return this.$route.meta?.pageTitle || "Garment Manufacturing ERP";
    },
  },

  methods: {
    /**
     * Clears current session context and routes user back to internal staff login
     */
    handleLogout() {
      this.$router.push("/login");
    },
  },
};
</script>
