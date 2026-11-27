<template>
  <div class="order_management pa-2">
    <div class="d-flex flex-wrap justify-space-between align-center mb-3 ga-2">
      <v-tabs
        v-model="activeTab"
        color="primary"
        class="erp_tabs"
      >
        <v-tab value="orders" style="text-transform: none">Orders</v-tab>
        <v-tab value="styles" style="text-transform: none">Garment Styles</v-tab>
      </v-tabs>

      <v-btn
        variant="outlined"
        color="primary"
        prepend-icon="mdi-chart-box-outline"
        style="text-transform: none"
        @click="$router.push('/admin/order-status')"
      >
        Order Status Report
      </v-btn>
    </div>

    <v-window v-model="activeTab">
      <v-window-item value="orders">
        <OrderTable
          :orders="orders"
          :customers="customers"
          :styles="styles"
          :loading="loadingOrders"
          @openCreateForm="openCreateForm"
          @refreshOrders="fetchOrders"
        />
      </v-window-item>

      <v-window-item value="styles">
        <GarmentStyleTable
          :styles="styles"
          :loading="loadingStyles"
          @stylesChanged="handleStylesChanged"
        />
      </v-window-item>
    </v-window>

    <!-- New Order Dialog -->
    <v-dialog v-model="showCreateForm" max-width="760px" persistent>
      <v-card class="pa-2">
        <v-card-title class="d-flex justify-space-between align-center">
          <span class="font-weight-bold">New Order</span>
          <v-btn icon variant="text" @click="closeCreateForm(false)">
            <v-icon color="primary">mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <AddOrder
            v-if="showCreateForm"
            :customers="customers"
            :styles="styles"
            :next-order-no="nextOrderNo"
            @closeForm="closeCreateForm"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import OrderTable from "@/views/AdminSide/OrderManagement/Components/Table.vue";
import AddOrder from "@/views/AdminSide/OrderManagement/Components/AddOrder.vue";
import GarmentStyleTable from "@/views/AdminSide/OrderManagement/Components/GarmentStyleTable.vue";
import orderService, { generateNextOrderNo } from "@/services/orderService";

export default {
  name: "OrderManagementIndex",
  components: {
    OrderTable,
    AddOrder,
    GarmentStyleTable,
  },

  data() {
    return {
      activeTab: "orders",
      showCreateForm: false,
      loadingOrders: false,
      loadingStyles: false,
      orders: [],
      customers: [],
      styles: [],
    };
  },

  computed: {
    nextOrderNo() {
      return generateNextOrderNo(this.orders);
    },
  },

  async created() {
    await Promise.all([
      this.fetchOrders(),
      this.fetchCustomers(),
      this.fetchStyles(),
    ]);
  },

  methods: {
    async fetchOrders() {
      this.loadingOrders = true;
      try {
        this.orders = await orderService.getAllOrders();
      } finally {
        this.loadingOrders = false;
      }
    },

    async fetchCustomers() {
      this.customers = await orderService.getCustomers();
    },

    async fetchStyles() {
      this.loadingStyles = true;
      try {
        this.styles = await orderService.getGarmentStyles();
      } finally {
        this.loadingStyles = false;
      }
    },

    async handleStylesChanged() {
      await this.fetchStyles();
    },

    openCreateForm() {
      this.showCreateForm = true;
    },

    async closeCreateForm(shouldRefresh = false) {
      this.showCreateForm = false;
      if (shouldRefresh) {
        await this.fetchOrders();
      }
    },
  },
};
</script>
