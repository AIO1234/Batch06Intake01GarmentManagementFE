<template>
  <div class="order_management pa-2">
    <!-- Top Navigation Tabs: Orders | Garment Styles | Order Status Report -->
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
      <!-- Screen A - Tab 1: Orders List, Inline New Order Form, and Quick-Add Style -->
      <v-window-item value="orders">
        <OrderTable
          :orders="orders"
          :customers="customers"
          :styles="styles"
          :loading="loadingOrders"
          @openCreateForm="openCreateForm"
          @refreshOrders="handleOrdersChanged"
        />

        <!-- Inline New Order Card (shown by default below the Orders table) -->
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

        <!-- Quick-Add Garment Style Card (synced with Garment Styles tab & Style dropdown) -->
        <QuickAddGarmentStyle
          class="mt-4"
          @stylesChanged="handleStylesChanged"
        />
      </v-window-item>

      <!-- Screen A - Tab 2: Garment Styles CRUD Management -->
      <v-window-item value="styles">
        <GarmentStyleTable
          :styles="styles"
          :loading="loadingStyles"
          @stylesChanged="handleStylesChanged"
        />
      </v-window-item>

      <!-- Screen B: Order Status Report with Filters & CSV Export -->
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
      // Currently active tab ('orders', 'styles', or 'report')
      activeTab: "orders",
      // Controls visibility of the inline New Order form
      showCreateForm: true,
      loadingOrders: false,
      loadingStyles: false,
      // Master and transactional data lists
      orders: [],
      customers: [],
      styles: [],
    };
  },

  computed: {
    // Auto-incremented preview number for the next created order
    nextOrderNo() {
      return generateNextOrderNo(this.orders);
    },
  },

  watch: {
    // Refresh the Order Status Report whenever the user switches to the report tab
    activeTab(tab) {
      if (tab === "report" && this.$refs.orderStatusReport) {
        this.$refs.orderStatusReport.refresh();
      }
    },
  },

  async created() {
    // Load orders, customers, and garment styles concurrently on page mount
    await Promise.all([
      this.fetchOrders(),
      this.fetchCustomers(),
      this.fetchStyles(),
    ]);
  },

  methods: {
    // Load all orders from API/service
    async fetchOrders() {
      this.loadingOrders = true;
      try {
        this.orders = await orderService.getAllOrders();
      } finally {
        this.loadingOrders = false;
      }
    },

    // Load customer master data for dropdowns
    async fetchCustomers() {
      this.customers = await orderService.getCustomers();
    },

    // Load garment styles master data for dropdowns and styles table
    async fetchStyles() {
      this.loadingStyles = true;
      try {
        this.styles = await orderService.getGarmentStyles();
      } finally {
        this.loadingStyles = false;
      }
    },

    // Reload orders and keep the Order Status Report in sync
    async handleOrdersChanged() {
      await this.fetchOrders();
      if (this.$refs.orderStatusReport) {
        await this.$refs.orderStatusReport.refresh();
      }
    },

    // Reload garment styles so new/edited styles immediately appear in Order dropdowns
    async handleStylesChanged() {
      await this.fetchStyles();
    },

    // Expand and smoothly scroll to the New Order card when "+ New Order" is clicked
    openCreateForm() {
      this.showCreateForm = true;
      this.$nextTick(() => {
        if (this.$refs.newOrderSection) {
          this.$refs.newOrderSection.scrollIntoView({ behavior: "smooth" });
        }
      });
    },

    // Handle New Order form completion: refresh list on save or collapse on cancel
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
