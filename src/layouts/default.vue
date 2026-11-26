<template>
  <div class="erp-layout">
    <div class="erp-sidebar-col">
      <SideBar />
    </div>
    <div class="erp-main-col">
      <HorizantalBar />
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
/* Scoped styles are handled globally via admin.scss and sidebar.scss */
</style>
