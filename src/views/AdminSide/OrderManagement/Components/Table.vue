<template>
  <div>
    <v-card class="pa-4" elevation="2">
      <!-- Search input and "+ New Order" action button -->
      <v-row class="mb-3 align-center" dense>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="searchQuery"
            prepend-inner-icon="mdi-magnify"
            placeholder="Search order no. / customer..."
            variant="outlined"
            density="compact"
            hide-details
            clearable
          />
        </v-col>
        <v-col cols="12" md="6" class="text-md-right">
          <v-btn
            class="erp_primary_btn"
            prepend-icon="mdi-plus"
            @click="$emit('openCreateForm')"
          >
            New Order
          </v-btn>
        </v-col>
      </v-row>

      <!-- Orders Data Table -->
      <v-data-table
        class="erp_table"
        :items="filteredOrders"
        :headers="headers"
        :loading="loading"
        :items-per-page="10"
        hover
      >
        <!-- Format Unit Price with 2 decimal places -->
        <template #[`item.unit_price`]="{ item }">
          {{ formatCurrency(item.unit_price) }}
        </template>

        <!-- Colour-coded Status Badge -->
        <template #[`item.status`]="{ item }">
          <span class="status_badge" :style="badgeStyle(item.status)">
            {{ item.status }}
          </span>
        </template>

        <!-- Row Action Buttons: Edit & Delete -->
        <template #[`item.action`]="{ item }">
          <div class="d-flex ga-2">
            <v-btn
              size="small"
              color="primary"
              variant="tonal"
              style="text-transform: capitalize"
              @click="openEditForm(item)"
            >
              Edit
            </v-btn>
            <v-btn
              size="small"
              color="error"
              variant="tonal"
              style="text-transform: capitalize"
              @click="deleteOrder(item)"
            >
              Delete
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Edit Order Modal Dialog -->
    <v-dialog v-model="showEditForm" max-width="680px" persistent>
      <v-card class="pa-2">
        <v-card-title class="d-flex justify-space-between align-center">
          <span class="font-weight-bold">Edit Order</span>
          <v-btn icon variant="text" @click="closeEditForm(false)">
            <v-icon color="primary">mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <UpdateOrder
            :selected-item="selectedItem"
            :customers="customers"
            :styles="styles"
            @closeModal="closeEditForm"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import UpdateOrder from "@/views/AdminSide/OrderManagement/Components/UpdateOrder.vue";
import orderService, { getStatusColor } from "@/services/orderService";

export default {
  name: "OrderTable",
  components: {
    UpdateOrder,
  },

  props: {
    // List of order records passed from parent page
    orders: {
      type: Array,
      default: () => [],
    },
    // Customer master list passed down to UpdateOrder modal
    customers: {
      type: Array,
      default: () => [],
    },
    // Garment style master list passed down to UpdateOrder modal
    styles: {
      type: Array,
      default: () => [],
    },
    // Loading state for table spinner
    loading: {
      type: Boolean,
      default: false,
    },
  },

  emits: ["openCreateForm", "refreshOrders"],

  data() {
    return {
      // Text filter applied across order number, customer, style, and status
      searchQuery: "",
      // Controls Edit Order dialog visibility
      showEditForm: false,
      // Currently selected order object for editing
      selectedItem: {},
      // Vuetify v-data-table column configuration
      headers: [
        { title: "Order No.", key: "order_no" },
        { title: "Date", key: "order_date" },
        { title: "Customer", key: "customer_name" },
        { title: "Style", key: "style_label" },
        { title: "Qty", key: "quantity", align: "end" },
        { title: "Unit Price", key: "unit_price", align: "end" },
        { title: "Delivery", key: "delivery_date" },
        { title: "Status", key: "status" },
        { title: "Action", key: "action", sortable: false },
      ],
    };
  },

  computed: {
    // Filter orders live based on search query
    filteredOrders() {
      const q = (this.searchQuery || "").trim().toLowerCase();
      if (!q) return this.orders;
      return this.orders.filter((item) => {
        return (
          String(item.order_no || "").toLowerCase().includes(q) ||
          String(item.customer_name || "").toLowerCase().includes(q) ||
          String(item.style_label || "").toLowerCase().includes(q) ||
          String(item.status || "").toLowerCase().includes(q)
        );
      });
    },
  },

  methods: {
    // Format numeric price as comma-separated currency with 2 decimal places
    formatCurrency(value) {
      const num = Number(value || 0);
      return num.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    },

    // Compute inline CSS colors for the status pill
    badgeStyle(status) {
      const color = getStatusColor(status);
      return {
        backgroundColor: color.bg,
        color: color.text,
      };
    },

    // Open Edit Order dialog with a shallow copy of the clicked row
    openEditForm(item) {
      this.selectedItem = { ...item };
      this.showEditForm = true;
    },

    // Close Edit Order dialog and trigger parent refresh if changes were saved
    closeEditForm(shouldRefresh = false) {
      this.showEditForm = false;
      if (shouldRefresh) {
        this.$emit("refreshOrders");
      }
    },

    // Confirm with SweetAlert2 before deleting an order record
    async deleteOrder(item) {
      const result = await Swal.fire({
        icon: "warning",
        title: "Delete Order?",
        text: `Are you sure you want to delete ${item.order_no}?`,
        showCancelButton: true,
        confirmButtonColor: "#d33",
        confirmButtonText: "Yes, delete",
      });

      if (result.isConfirmed) {
        await orderService.deleteOrder(item.id);
        this.$emit("refreshOrders");
        Swal.fire({
          icon: "success",
          title: "Deleted",
          text: `Order ${item.order_no} removed.`,
          timer: 1500,
          showConfirmButton: false,
        });
      }
    },
  },
};
</script>
