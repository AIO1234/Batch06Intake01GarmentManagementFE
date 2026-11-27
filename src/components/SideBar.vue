<template>
  <!-- changes -->
  <v-app-bar-nav-icon
    @click.stop="drawer = !drawer"
    style="color: #0a72af"
  ></v-app-bar-nav-icon>
  <v-navigation-drawer v-model="drawer" temporary style="height: 100%">
    <v-list density="compact" nav>
      <!-- Home -->
      <v-list-item
        active-class="ative_color"
        prepend-icon="mdi-home-account"
        title="Dashboard"
        value="Dashboard"
        @click="$router.push('/admin/dashboard')"
      >
      </v-list-item>
      <!-- users -->
      <v-list-item
        active-class="ative_color"
        prepend-icon="mdi-account-tie"
        title="Users"
        value="Users"
        @click="$router.push('/admin/users')"
      ></v-list-item>
      <!-- orders & styles -->
      <v-list-item
        active-class="ative_color"
        prepend-icon="mdi-hanger"
        title="Orders & Styles"
        value="Orders"
        @click="$router.push('/admin/orders')"
      ></v-list-item>
      <!-- order status report -->
      <v-list-item
        active-class="ative_color"
        prepend-icon="mdi-chart-box-outline"
        title="Order Status"
        value="OrderStatus"
        @click="$router.push('/admin/order-status')"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
<script>
export default {
  data() {
    return {
      drawer: false,
    };
  },

  methods: {
    GotoLeavePage() {
      // route home page
      this.$router.push({ name: "leaves" });
    },
  },
};
</script>
