<template>
  <div class="order_form_card pa-2">
    <!-- Edit Order Form (includes Status Workflow Dropdown) -->
    <v-form
      ref="updateOrderForm"
      v-model="isFormValid"
      @submit.prevent="updateOrder"
    >
      <v-row dense>
        <!-- Read-only Order Number -->
        <v-col cols="12" md="6">
          <label class="form_label">Order No.</label>
          <v-text-field
            v-model="form.order_no"
            variant="outlined"
            density="compact"
            readonly
            disabled
          />
        </v-col>

        <!-- Order Date -->
        <v-col cols="12" md="6">
          <label class="form_label">Order Date *</label>
          <v-text-field
            v-model="form.order_date"
            type="date"
            variant="outlined"
            density="compact"
            :rules="[required]"
          />
        </v-col>

        <!-- Customer Dropdown -->
        <v-col cols="12" md="6">
          <label class="form_label">Customer *</label>
          <v-select
            v-model="form.customer_id"
            :items="customers"
            item-title="name"
            item-value="id"
            variant="outlined"
            density="compact"
            :rules="[required]"
          />
        </v-col>

        <!-- Garment Style Dropdown -->
        <v-col cols="12" md="6">
          <label class="form_label">Style *</label>
          <v-select
            v-model="form.garment_style_id"
            :items="formattedStyles"
            item-title="label"
            item-value="id"
            variant="outlined"
            density="compact"
            :rules="[required]"
          />
        </v-col>

        <!-- Quantity (> 0) -->
        <v-col cols="12" md="6">
          <label class="form_label">Quantity *</label>
          <v-text-field
            v-model.number="form.quantity"
            type="number"
            min="1"
            step="1"
            variant="outlined"
            density="compact"
            :rules="[required, positiveIntegerRule]"
          />
        </v-col>

        <!-- Unit Price (>= 0) -->
        <v-col cols="12" md="6">
          <label class="form_label">Unit Price (LKR) *</label>
          <v-text-field
            v-model.number="form.unit_price"
            type="number"
            min="0"
            step="0.01"
            variant="outlined"
            density="compact"
            :rules="[requiredPrice, nonNegativePriceRule]"
          />
        </v-col>

        <!-- Delivery Date (>= Order Date) -->
        <v-col cols="12" md="6">
          <label class="form_label">Delivery Date *</label>
          <v-text-field
            v-model="form.delivery_date"
            type="date"
            :min="form.order_date"
            variant="outlined"
            density="compact"
            :rules="[required, deliveryDateRule]"
          />
        </v-col>

        <!-- Status Dropdown enforcing forward flow: Pending -> In Production -> QA -> Dispatched -> Completed -->
        <v-col cols="12" md="6">
          <label class="form_label">Status *</label>
          <v-select
            v-model="form.status"
            :items="statusSelectItems"
            item-title="title"
            item-value="value"
            :item-props="(item) => ({ disabled: item.disabled })"
            variant="outlined"
            density="compact"
            :rules="[required, statusFlowRule]"
            hint="Flow: Pending → In Production → QA → Dispatched → Completed"
            persistent-hint
          />
        </v-col>
      </v-row>

      <!-- Modal Action Buttons -->
      <div class="d-flex justify-end ga-3 mt-4">
        <v-btn
          variant="outlined"
          color="grey-darken-1"
          @click="$emit('closeModal', false)"
        >
          Cancel
        </v-btn>
        <v-btn
          type="submit"
          class="erp_primary_btn"
          :loading="showLoader"
          :disabled="!isFormValid"
        >
          Update Order
        </v-btn>
      </div>
    </v-form>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import orderService, {
  ORDER_STATUS_FLOW,
  formatStyleLabel,
} from "@/services/orderService";

export default {
  name: "UpdateOrder",
  props: {
    // Order object selected from the table
    selectedItem: {
      type: Object,
      default: () => ({}),
    },
    customers: {
      type: Array,
      default: () => [],
    },
    styles: {
      type: Array,
      default: () => [],
    },
  },

  emits: ["closeModal"],

  data() {
    return {
      isFormValid: false,
      showLoader: false,
      // Tracks original status to disallow moving backwards in the workflow
      initialStatus: "Pending",
      form: {
        id: null,
        order_no: "",
        order_date: "",
        customer_id: null,
        garment_style_id: null,
        quantity: null,
        unit_price: null,
        delivery_date: "",
        status: "Pending",
      },
    };
  },

  computed: {
    // Format garment styles for display in v-select
    formattedStyles() {
      return this.styles.map((style) => ({
        id: style.id,
        label: formatStyleLabel(style),
      }));
    },

    // Disable workflow stages earlier than the order's current status
    statusSelectItems() {
      const currentIdx = ORDER_STATUS_FLOW.indexOf(this.initialStatus);
      return ORDER_STATUS_FLOW.map((status, idx) => ({
        title: status,
        value: status,
        disabled: currentIdx !== -1 && idx < currentIdx,
      }));
    },
  },

  watch: {
    // Populate form fields whenever a different order row is opened for editing
    selectedItem: {
      immediate: true,
      handler(item) {
        if (!item) return;
        this.initialStatus = item.status || "Pending";
        this.form = {
          id: item.id,
          order_no: item.order_no || "",
          order_date: item.order_date || "",
          customer_id: item.customer_id ?? null,
          garment_style_id: item.garment_style_id ?? null,
          quantity: item.quantity ?? null,
          unit_price: item.unit_price ?? null,
          delivery_date: item.delivery_date || "",
          status: item.status || "Pending",
        };
      },
    },
  },

  methods: {
    required(v) {
      return (v !== null && v !== undefined && v !== "") || "Field is required";
    },

    requiredPrice(v) {
      return (
        (v !== null && v !== undefined && v !== "") ||
        "Unit price is required"
      );
    },

    positiveIntegerRule(v) {
      const num = Number(v);
      return (
        (Number.isInteger(num) && num > 0) ||
        "Quantity must be a whole number greater than 0"
      );
    },

    nonNegativePriceRule(v) {
      const num = Number(v);
      return (!Number.isNaN(num) && num >= 0) || "Unit price must be 0 or more";
    },

    deliveryDateRule(v) {
      if (!v || !this.form.order_date) return true;
      return (
        v >= this.form.order_date ||
        "Delivery date cannot be earlier than the order date"
      );
    },

    // Validate status only stays at or advances along the lifecycle flow
    statusFlowRule(v) {
      const currentIdx = ORDER_STATUS_FLOW.indexOf(this.initialStatus);
      const nextIdx = ORDER_STATUS_FLOW.indexOf(v);
      if (currentIdx === -1 || nextIdx === -1) return true;
      return (
        nextIdx >= currentIdx ||
        `Status cannot move backwards from ${this.initialStatus}`
      );
    },

    // Save updated order changes via orderService
    async updateOrder() {
      const { valid } = await this.$refs.updateOrderForm.validate();
      if (!valid) return;

      this.showLoader = true;
      try {
        await orderService.updateOrder(this.form.id, this.form);
        Swal.fire({
          icon: "success",
          title: "Order Updated",
          text: `Order ${this.form.order_no} has been updated.`,
          timer: 1800,
          showConfirmButton: false,
        });
        this.$emit("closeModal", true);
      } finally {
        this.showLoader = false;
      }
    },
  },
};
</script>
