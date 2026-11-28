<template>
  <div class="order_form_card pa-2">
    <v-form ref="addOrderForm" v-model="isFormValid" @submit.prevent="storeOrder">
      <v-row dense>
        <v-col cols="12" md="4">
          <label class="form_label">Order No.</label>
          <v-text-field
            :model-value="`Auto: ${nextOrderNo}`"
            variant="outlined"
            density="compact"
            readonly
            disabled
          />
        </v-col>

        <v-col cols="12" md="4">
          <label class="form_label">Customer *</label>
          <v-select
            v-model="form.customer_id"
            :items="customers"
            item-title="name"
            item-value="id"
            placeholder="Select customer"
            variant="outlined"
            density="compact"
            :rules="[required]"
          />
        </v-col>

        <v-col cols="12" md="4">
          <label class="form_label">Style *</label>
          <v-select
            v-model="form.garment_style_id"
            :items="formattedStyles"
            item-title="label"
            item-value="id"
            placeholder="Select garment style"
            variant="outlined"
            density="compact"
            :rules="[required]"
          />
        </v-col>

        <v-col cols="12" md="4">
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

        <v-col cols="12" md="4">
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

        <v-col cols="12" md="4">
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

        <v-col cols="12" md="4">
          <label class="form_label">Status</label>
          <v-select
            v-model="form.status"
            :items="statusOptions"
            variant="outlined"
            density="compact"
            :rules="[required]"
          />
        </v-col>

        <v-col cols="12" md="4">
          <label class="form_label">Order Date *</label>
          <v-text-field
            v-model="form.order_date"
            type="date"
            variant="outlined"
            density="compact"
            :rules="[required]"
          />
        </v-col>
      </v-row>

      <div class="d-flex justify-end ga-3 mt-4">
        <v-btn
          variant="outlined"
          color="grey-darken-1"
          @click="handleCancel"
        >
          Cancel
        </v-btn>
        <v-btn
          type="submit"
          class="erp_primary_btn"
          :loading="showLoader"
          :disabled="!isFormValid"
        >
          Save Order
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
  name: "AddOrder",
  props: {
    customers: {
      type: Array,
      default: () => [],
    },
    styles: {
      type: Array,
      default: () => [],
    },
    nextOrderNo: {
      type: String,
      default: "ORD-2026-0001",
    },
  },

  emits: ["closeForm"],

  data() {
    const today = new Date().toISOString().slice(0, 10);
    return {
      isFormValid: false,
      showLoader: false,
      statusOptions: ORDER_STATUS_FLOW,
      form: {
        order_date: today,
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
    formattedStyles() {
      return this.styles.map((style) => ({
        id: style.id,
        label: formatStyleLabel(style),
      }));
    },
  },

  watch: {
    "form.order_date"() {
      if (this.$refs.addOrderForm) {
        this.$refs.addOrderForm.validate();
      }
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

    resetFormFields() {
      const today = new Date().toISOString().slice(0, 10);
      this.form = {
        order_date: today,
        customer_id: null,
        garment_style_id: null,
        quantity: null,
        unit_price: null,
        delivery_date: "",
        status: "Pending",
      };
      if (this.$refs.addOrderForm) {
        this.$refs.addOrderForm.resetValidation();
      }
    },

    handleCancel() {
      this.resetFormFields();
      this.$emit("closeForm", false);
    },

    async storeOrder() {
      const { valid } = await this.$refs.addOrderForm.validate();
      if (!valid) return;

      this.showLoader = true;
      try {
        await orderService.createOrder({
          ...this.form,
          order_no: this.nextOrderNo,
        });
        Swal.fire({
          icon: "success",
          title: "Order Saved",
          text: `Order ${this.nextOrderNo} has been created.`,
          timer: 1800,
          showConfirmButton: false,
        });
        this.resetFormFields();
        this.$emit("closeForm", true);
      } finally {
        this.showLoader = false;
      }
    },
  },
};
</script>
