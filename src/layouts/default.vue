<!-- =========================================================================================
  Garment Manufacturing ERP - Default Layout Component
  File: src/layouts/default.vue
  Student Project · SRS v1.4 (Week 1 Frontend Deliverable)
  Purpose:
    - Provides the master frame for internal staff across all 11 ERP functions.
    - Assembles the persistent left sidebar navigation (#12303b), the top horizontal bar
      with page title and user status ("Nimal P. · Administrator · ⎋ Logout"), and the
      main content area (<router-view />) on a light cool grey background (#f3f6f8).
========================================================================================== -->

<template>
  <div class="erp-layout">
    <!-- ===================================================================================
         LEFT SIDEBAR COLUMN
         Contains the fixed 11-function navigation menu with Garment ERP brand identity
    ==================================================================================== -->
    <div class="erp-sidebar-col">
      <SideBar />
    </div>

    <!-- ===================================================================================
         MAIN VIEWPORT COLUMN
         Contains top status header and the active view rendered by Vue Router
    ==================================================================================== -->
    <div class="erp-main-col">
      <!-- Top header bar: Displays current page title, logged-in user and role -->
      <HorizantalBar />

      <!-- Main page content container: Styled per SRS §6 layout specifications -->
      <main class="erp-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
import SideBar from "@/components/SideBar.vue";
import HorizantalBar from "@/components/HorizantalBar.vue";

export default {
  name: "DefaultLayout",

  components: {
    SideBar,
    HorizantalBar,
  },
};
</script>

<style scoped>
/* Core layout styles are defined globally in src/assets/scss/admin.scss and sidebar.scss */
</style>
