<template>
  <div class="order_management pa-2">
    <div class="d-flex flex-wrap justify-space-between align-center mb-3 ga-2">
      <v-tabs v-model="activeTab" color="primary" class="erp_tabs">
        <v-tab value="orders" style="text-transform: none">Orders</v-tab>
        <v-tab value="styles" style="text-transform: none">Garment Styles</v-tab>
        <v-tab value="report" style="text-transform: none">
          Order Status Report
        </v-tab>
      </v-tabs>
    </div>

    <v-window v-model="activeTab">
      <!-- Screen A - Tab 1: Orders (Table + New Order + Quick Add Garment Style) -->
      <v-window-item value="orders">
        <OrderTable
          :orders="orders"
          :customers="customers"
          :styles="styles"
          :loading="loadingOrders"
          @openCreateForm="openCreateForm"
          @refreshOrders="handleOrdersChanged"
        />

        <!-- New Order Card -->
        <v-expand-transition>
          <div ref="newOrderSection">
            <v-card v-if="showCreateForm" class="pa-4 mt-4" elevation="2">
              <div class="d-flex justify-space-between align-center mb-2">
                <span class="text-subtitle-1 font-weight-bold">New Order</span>
                <v-btn
                  icon
                  variant="text"
                  size="small"
                  @click="closeCreateForm(false)"
                >
                  <v-icon color="primary">mdi-close</v-icon>
                </v-btn>
              </div>
              <AddOrder
                :customers="customers"
                :styles="styles"
                :next-order-no="nextOrderNo"
                @closeForm="closeCreateForm"
              />
            </v-card>
          </div>
        </v-expand-transition>

        <!-- Garment Style Quick Add (Screen A Bottom Card) -->
        <QuickAddGarmentStyle
          class="mt-4"
          @stylesChanged="handleStylesChanged"
        />
      </v-window-item>

      <!-- Screen A - Tab 2: Garment Styles -->
      <v-window-item value="styles">
        <GarmentStyleTable
          :styles="styles"
          :loading="loadingStyles"
          @stylesChanged="handleStylesChanged"
        />
      </v-window-item>

      <!-- Screen B: Report: Order Status -->
      <v-window-item value="report">
        <OrderStatusReportComponent ref="orderStatusReport" />
      </v-window-item>
    </v-window>
  </div>
</template>

<script>
import OrderTable from "@/views/AdminSide/OrderManagement/Components/Table.vue";
import AddOrder from "@/views/AdminSide/OrderManagement/Components/AddOrder.vue";
import GarmentStyleTable from "@/views/AdminSide/OrderManagement/Components/GarmentStyleTable.vue";
import QuickAddGarmentStyle from "@/views/AdminSide/OrderManagement/Components/QuickAddGarmentStyle.vue";
import OrderStatusReportComponent from "@/views/AdminSide/OrderManagement/Components/OrderStatusReport.vue";
import orderService, { generateNextOrderNo } from "@/services/orderService";

export default {
  name: "OrderManagementIndex",
  components: {
    OrderTable,
    AddOrder,
    GarmentStyleTable,
    QuickAddGarmentStyle,
    OrderStatusReportComponent,
  },

  data() {
    return {
      activeTab: "orders",
      showCreateForm: true,
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

  watch: {
    activeTab(tab) {
      if (tab === "report" && this.$refs.orderStatusReport) {
        this.$refs.orderStatusReport.refresh();
      }
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

    async handleOrdersChanged() {
      await this.fetchOrders();
      if (this.$refs.orderStatusReport) {
        await this.$refs.orderStatusReport.refresh();
      }
    },

    async handleStylesChanged() {
      await this.fetchStyles();
    },

    openCreateForm() {
      this.showCreateForm = true;
      this.$nextTick(() => {
        if (this.$refs.newOrderSection) {
          this.$refs.newOrderSection.scrollIntoView({ behavior: "smooth" });
        }
      });
    },

    async closeCreateForm(shouldRefresh = false) {
      if (shouldRefresh) {
        await this.handleOrdersChanged();
      } else {
        this.showCreateForm = false;
      }
    },
  },
};
</script>
