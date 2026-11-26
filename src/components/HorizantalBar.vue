<template>
  <header class="erp-topbar">
    <div class="topbar-left">
      <h1 class="topbar-page-title">{{ displayTitle }}</h1>
    </div>

    <div class="topbar-right">
      <span class="user-name">Nimal P.</span>
      <span class="user-role-badge">Administrator</span>
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
    displayTitle() {
      return this.$route.meta?.pageTitle || "Garment Manufacturing ERP";
    },
  },
  methods: {
    handleLogout() {
      this.$router.push("/login");
    },
  },
};
</script>
