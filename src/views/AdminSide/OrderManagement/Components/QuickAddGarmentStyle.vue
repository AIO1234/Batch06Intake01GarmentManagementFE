<template>
  <!-- Shared Quick-Add Garment Style Card (used in both Orders tab and Garment Styles tab) -->
  <v-card class="pa-4 order_form_card" elevation="2">
    <div class="text-subtitle-1 font-weight-bold mb-3">
      Garment Style (Styles tab — quick add)
    </div>
    <v-form ref="addStyleForm" v-model="isFormValid" @submit.prevent="addStyle">
      <v-row dense class="align-start">
        <!-- Garment Style Name -->
        <v-col cols="12" md="4">
          <label class="form_label">Style Name *</label>
          <v-text-field
            v-model="form.style_name"
            placeholder="e.g. Polo Shirt"
            variant="outlined"
            density="compact"
            :rules="[required]"
          />
        </v-col>

        <!-- Size Dropdown -->
        <v-col cols="12" md="3">
          <label class="form_label">Size *</label>
          <v-select
            v-model="form.size"
            :items="sizeOptions"
            placeholder="Select size"
            variant="outlined"
            density="compact"
            :rules="[required]"
          />
        </v-col>

        <!-- Colour Input -->
        <v-col cols="12" md="3">
          <label class="form_label">Colour *</label>
          <v-text-field
            v-model="form.colour"
            placeholder="e.g. Blue"
            variant="outlined"
            density="compact"
            :rules="[required]"
          />
        </v-col>

        <!-- Submit Button -->
        <v-col cols="12" md="2" class="pt-md-6">
          <v-btn
            type="submit"
            variant="outlined"
            color="primary"
            block
            height="40"
            style="text-transform: none; font-weight: 600"
            :loading="saving"
            :disabled="!isFormValid"
          >
            Add Style
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-card>
</template>

<script>
import Swal from "sweetalert2";
import orderService, { GARMENT_SIZES } from "@/services/orderService";

export default {
  name: "QuickAddGarmentStyle",

  emits: ["stylesChanged"],

  data() {
    return {
      isFormValid: false,
      saving: false,
      sizeOptions: GARMENT_SIZES,
      form: {
        style_name: "",
        size: "M",
        colour: "",
      },
    };
  },

  methods: {
    // Reject empty or whitespace-only values
    required(v) {
      return (
        (v !== null && v !== undefined && String(v).trim() !== "") ||
        "Field is required"
      );
    },

    // Save new garment style and emit stylesChanged to refresh master lists
    async addStyle() {
      const { valid } = await this.$refs.addStyleForm.validate();
      if (!valid) return;

      this.saving = true;
      try {
        await orderService.createGarmentStyle(this.form);
        this.$refs.addStyleForm.reset();
        this.form = { style_name: "", size: "M", colour: "" };
        this.$emit("stylesChanged");
        Swal.fire({
          icon: "success",
          title: "Garment Style Added",
          timer: 1500,
          showConfirmButton: false,
        });
      } finally {
        this.saving = false;
      }
    },
  },
};
</script>
