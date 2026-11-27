<template>
  <aside class="erp-sidebar">
    <!-- Brand Header -->
    <div class="sidebar-brand">
      <div class="brand-title">
        <span class="brand-dot"></span>
        GARMENT ERP
      </div>
      <div class="brand-sub">Manufacturing System v1.4</div>
    </div>

    <!-- Navigation Menu (Aligned with SRS §7 & §8 Navigation Map) -->
    <ul class="sidebar-menu">
      <li
        v-for="item in menuItems"
        :key="item.route"
        class="nav-item"
      >
<<<<<<< HEAD
        <router-link
          :to="item.route"
          class="nav-link"
          :class="{ active: isRouteActive(item.route) }"
        >
          <span v-if="item.num" class="nav-num">{{ item.num }}</span>
          <span v-else class="nav-num">▸</span>
          <span class="nav-label">{{ item.label }}</span>
        </router-link>
      </li>
    </ul>

    <!-- Footer note -->
    <div class="sidebar-footer">
      <span>Student Project · SRS v1.4</span>
    </div>
  </aside>
=======
      </v-list-item>
      <!-- users -->
      <v-list-item
        active-class="ative_color"
        prepend-icon="mdi-account-tie"
        title="Users"
        value="Users"
        @click="$router.push('/admin/users')"
      ></v-list-item>
       <!-- Product Management -->
      <v-list-item
        active-class="ative_color"
        prepend-icon="mdi-package-variant-closed"
        title="Product Management"
        value="Product Management"
        @click="$router.push('/admin/product-management')"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
>>>>>>> inuka
</template>

<script>
export default {
<<<<<<< HEAD
  name: "SideBar",
  data() {
    return {
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
        { label: "Dispatch", route: "/dispatch", num: "10" },
        { label: "Invoicing", route: "/invoices", num: "11" },
      ],
    };
  },
=======
    data() {
      return {
        drawer: false,
      };
    },

>>>>>>> inuka
  methods: {
    isRouteActive(routePath) {
      if (routePath === "/dispatch") {
        return (
          this.$route.path === "/dispatch" ||
          this.$route.path.startsWith("/admin/dispatch")
        );
      }
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
