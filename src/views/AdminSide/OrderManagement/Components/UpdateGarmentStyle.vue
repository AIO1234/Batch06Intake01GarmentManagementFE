<template>
  <div class="order_form_card pa-2">
    <!-- Edit Garment Style Form -->
    <v-form
      ref="updateStyleForm"
      v-model="isFormValid"
      @submit.prevent="updateStyle"
    >
      <v-row dense>
        <v-col cols="12">
          <label class="form_label">Style Name *</label>
          <v-text-field
            v-model="form.style_name"
            variant="outlined"
            density="compact"
            :rules="[required]"
          />
        </v-col>

        <v-col cols="12" md="6">
          <label class="form_label">Size *</label>
          <v-select
            v-model="form.size"
            :items="sizeOptions"
            variant="outlined"
            density="compact"
            :rules="[required]"
          />
        </v-col>

        <v-col cols="12" md="6">
          <label class="form_label">Colour *</label>
          <v-text-field
            v-model="form.colour"
            variant="outlined"
            density="compact"
            :rules="[required]"
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
          Update Style
        </v-btn>
      </div>
    </v-form>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import orderService, { GARMENT_SIZES } from "@/services/orderService";

export default {
  name: "UpdateGarmentStyle",
  props: {
    // Garment style object selected for editing
    selectedItem: {
      type: Object,
      default: () => ({}),
    },
  },

  emits: ["closeModal"],

  data() {
    return {
      isFormValid: false,
      showLoader: false,
      sizeOptions: GARMENT_SIZES,
      form: {
        id: null,
        style_name: "",
        size: "",
        colour: "",
      },
    };
  },

  watch: {
    // Sync local form fields whenever selectedItem changes
    selectedItem: {
      immediate: true,
      handler(item) {
        if (!item) return;
        this.form = {
          id: item.id,
          style_name: item.style_name || "",
          size: item.size || "",
          colour: item.colour || "",
        };
      },
    },
  },

  methods: {
    required(v) {
      return (
        (v !== null && v !== undefined && String(v).trim() !== "") ||
        "Field is required"
      );
    },

    // Persist garment style edits via orderService
    async updateStyle() {
      const { valid } = await this.$refs.updateStyleForm.validate();
      if (!valid) return;

      this.showLoader = true;
      try {
        await orderService.updateGarmentStyle(this.form.id, this.form);
        Swal.fire({
          icon: "success",
          title: "Style Updated",
          timer: 1500,
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
