<template>
  <div class="pl-5 pr-5 mt-1">
    <v-container class="form">
      <v-form v-model="validated">
        <v-row>
          <!-- Inspection Date -->
          <v-col lg="12" cols="12">
            <label class="label">Inspection Date *</label>
            <div class="mt-2"></div>
            <v-text-field
              class="input"
              variant="outlined"
              type="date"
              v-model="form.date"
              :rules="[required]"
            ></v-text-field>
          </v-col>

          <!-- Order -->
          <v-col lg="12" cols="12">
            <label class="label">Order *</label>
            <div class="mt-2"></div>
            <v-select
              class="input"
              variant="outlined"
              v-model="form.order"
              :items="orders"
              item-title="title"
              item-value="value"
              :rules="[required]"
              placeholder="Select Order"
            ></v-select>
          </v-col>

          <!-- Uninspected Completed Quantity -->
          <v-col lg="12" cols="12">
            <label class="label">Uninspected Completed</label>
            <div class="mt-2"></div>
            <v-text-field
              class="input"
              variant="outlined"
              v-model="form.uninspected"
              readonly
            ></v-text-field>
          </v-col>

          <!-- Inspected Quantity -->
          <v-col lg="12" cols="12">
            <label class="label">Inspected Qty *</label>
            <div class="mt-2"></div>
            <v-text-field
              class="input"
              variant="outlined"
              type="number"
              v-model.number="form.inspected"
              :rules="[required, positiveNumber, inspectedLimit]"
            ></v-text-field>
          </v-col>

          <!-- Approved Quantity -->
          <v-col lg="12" cols="12">
            <label class="label">Approved Qty *</label>
            <div class="mt-2"></div>
            <v-text-field
              class="input"
              variant="outlined"
              type="number"
              v-model.number="form.approved"
              :rules="[required, positiveNumber, approvedLimit]"
            ></v-text-field>
          </v-col>

          <!-- Defective Quantity -->
          <v-col lg="12" cols="12">
            <label class="label">Defective Qty *</label>
            <div class="mt-2"></div>
            <v-text-field
              class="input"
              variant="outlined"
              type="number"
              v-model.number="form.defective"
              :rules="[required, positiveNumber]"
            ></v-text-field>
          </v-col>

          <!-- Rework Quantity -->
          <v-col lg="12" cols="12">
            <label class="label">Rework Qty *</label>
            <div class="mt-2"></div>
            <v-text-field
              class="input"
              variant="outlined"
              type="number"
              v-model.number="form.rework"
              :rules="[required, positiveNumber, quantityLimit]"
            ></v-text-field>
          </v-col>
        </v-row>

        <!-- Form Buttons -->
        <v-row>
          <v-col cols="12" class="text-right">
            <v-btn
              color="primary"
              class="mr-2"
              @click="storeInspection()"
              :loading="showloader"
              :disabled="!validated"
            >
              Save
            </v-btn>

            <v-btn color="error" variant="outlined" @click="$emit('closeForm')">
              Close
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      validated: false,
      showloader: false,

      // form field values
      form: {
        date: "",
        order: "",
        uninspected: 0,
        inspected: null,
        approved: null,
        defective: null,
        rework: null,
      },

      orders: [],
    };
  },

  methods: {
    // Required field validation
    required(v) {
      return (v !== null && v !== undefined && v !== "") || "Field is required";
    },

    // Positive number validation (Quantity must be 0 or more)
    positiveNumber(v) {
      return (
        (v !== null && v !== "" && Number(v) >= 0) || "Enter a valid quantity"
      );
    },

    // Approved quantity validation (Approved cannot exceed uninspected completed)
    approvedLimit(v) {
      return (
        Number(v) <= Number(this.form.uninspected) ||
        "Approved quantity cannot exceed uninspected completed quantity"
      );
    },

    // Inspected quantity validation (Inspected quantity cannot exceed uninspected completed quantity)
    inspectedLimit(v) {
      return (
        Number(v) <= Number(this.form.uninspected) ||
        "Inspected quantity cannot exceed uninspected completed quantity"
      );
    },

    // Total quantity validation (Approved + Defective + Rework must equal Inspected Qty)
    quantityLimit(v) {
      return (
        Number(this.form.approved) + Number(this.form.defective) + Number(v) ===
          Number(this.form.inspected) ||
        "Approved + Defective + Rework must equal Inspected Qty"
      );
    },

    // Save inspection details

    storeInspection() {
      // Check form validity and loading status
      if (!this.validated || this.showloader) {
        return;
      }
      this.showloader = true;

      // Send data to parent component
      this.$emit("saveInspection", this.form);

      this.form = {
        date: "",
        order: "",
        uninspected: 0,
        inspected: null,
        approved: null,
        defective: null,
        rework: null,
      };

      this.showloader = false;
      // Requests the parent component to close the dialog box
      this.$emit("closeForm");
    },
  },
};
</script>
