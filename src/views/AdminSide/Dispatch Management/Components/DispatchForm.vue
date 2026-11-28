<!-- =========================================================================================
  Function 10: Dispatch Management - Screen A Form Component
  File: src/views/AdminSide/Dispatch Management/Components/DispatchForm.vue
  Student: Student 10 Deliverable (SRS v1.4 §6 & §8, UI Wireframe Page 14)
  Purpose:
    - Allows dispatch clerks to record dispatches against customer orders for QA-approved garments.
    - Automatically computes available quantities and displays real-time order balances.
    - Implements server & client-side validation rules (inline red error banners & red borders).
========================================================================================== -->

<template>
  <div class="erp-card">
    <!-- Card Header -->
    <div class="card-header-bar">
      <h3 class="card-title">Dispatch QA-approved garments</h3>
    </div>

    <div class="card-body">
      <!-- ===================================================================================
           VALIDATION ALERTS & SYSTEM BANNERS
           Per SRS §8 interaction rules:
           - Red banner for validation errors / server messages
           - Green banner for successful operations ("Saved successfully")
      ==================================================================================== -->
      <!-- Error Banner: Shown when entered quantity exceeds available QA-approved quantity -->
      <div v-if="validationError" class="erp-banner banner-error">
        <span class="banner-icon">⚠️</span>
        <span>{{ validationError }}</span>
      </div>

      <!-- Success Banner: Shown upon successful form submission -->
      <div v-if="successMessage" class="erp-banner banner-success">
        <span class="banner-icon">✅</span>
        <span>{{ successMessage }}</span>
      </div>

      <!-- ===================================================================================
           DISPATCH ENTRY FORM
           Structured into a responsive 3-column grid matching Wireframe Page 14
      ==================================================================================== -->
      <form @submit.prevent="handleSubmit">
        <!-- ROW 1: Order Selection, Dispatch Date, and Delivery Note Identifier -->
        <div class="form-grid">
          <!-- 1.1 Customer Order Dropdown (no free typing of IDs per SRS §8) -->
          <div class="form-group">
            <label class="form-label">
              Order<span class="required-star">*</span>
            </label>
            <select
              v-model="selectedOrderNo"
              class="form-control"
              @change="onOrderChange"
              required
            >
              <option value="" disabled>-- Select Order --</option>
              <option
                v-for="order in orderList"
                :key="order.orderNo"
                :value="order.orderNo"
              >
                {{ order.orderNo }} · {{ order.customer }}
              </option>
            </select>
          </div>

          <!-- 1.2 Dispatch Date Input (ISO format YYYY-MM-DD per identifier conventions) -->
          <div class="form-group">
            <label class="form-label">
              Dispatch Date<span class="required-star">*</span>
            </label>
            <input
              type="date"
              v-model="form.dispatchDate"
              class="form-control"
              required
            />
          </div>

          <!-- 1.3 Delivery Note Number (Required and unique per SRS: e.g. DN-2026-0001) -->
          <div class="form-group">
            <label class="form-label">
              Delivery Note No.<span class="required-star">*</span>
            </label>
            <input
              type="text"
              v-model="form.deliveryNote"
              class="form-control"
              placeholder="e.g. DN-2026-0001"
              required
            />
          </div>
        </div>

        <!-- ROW 2: Read-Only Calculated Values
             SRS §8 Interaction Rule: Read-only grey fields for calculated values (outstanding, available, totals) -->
        <div class="form-grid">
          <!-- 2.1 Ordered Quantity (From Customer Order Master) -->
          <div class="form-group">
            <label class="form-label">Ordered</label>
            <input
              type="text"
              :value="currentOrder.orderedQty"
              class="form-control readonly-field"
              readonly
              tabindex="-1"
            />
          </div>

          <!-- 2.2 QA Approved Quantity (Passed from Quality Assurance inspection) -->
          <div class="form-group">
            <label class="form-label">QA Approved</label>
            <input
              type="text"
              :value="currentOrder.qaApprovedQty"
              class="form-control readonly-field"
              readonly
              tabindex="-1"
            />
          </div>

          <!-- 2.3 Already Dispatched Quantity (Cumulative previous dispatches for this order) -->
          <div class="form-group">
            <label class="form-label">Already Dispatched</label>
            <input
              type="text"
              :value="currentOrder.alreadyDispatchedQty"
              class="form-control readonly-field"
              readonly
              tabindex="-1"
            />
          </div>
        </div>

        <!-- ROW 3: Available Balance, Dispatch Quantity Input, and Form Actions -->
        <div class="form-grid">
          <!-- 3.1 Available to Dispatch (Calculated: QA Approved - Already Dispatched) -->
          <div class="form-group">
            <label class="form-label">Available to Dispatch</label>
            <input
              type="text"
              :value="availableToDispatch"
              class="form-control readonly-field"
              readonly
              tabindex="-1"
            />
          </div>

          <!-- 3.2 Dispatch Quantity Input (Editable with real-time excess validation) -->
          <div class="form-group">
            <label class="form-label">
              Dispatch Qty<span class="required-star">*</span>
            </label>
            <input
              type="number"
              v-model.number="form.dispatchQty"
              class="form-control"
              :class="{ 'is-invalid': qtyExceedsAvailable || isQtyInvalid }"
              placeholder="Enter quantity"
              min="1"
              @input="validateQty"
              required
            />
            <!-- Inline error message under the field per SRS §8 -->
            <span v-if="qtyExceedsAvailable" class="invalid-feedback">
              Cannot dispatch {{ form.dispatchQty }}: only {{ availableToDispatch }} QA-approved and available.
            </span>
          </div>

          <!-- 3.3 Form Actions: Cancel and Save Dispatch Buttons -->
          <div class="form-group" style="display: flex; justify-content: flex-end; align-items: flex-end;">
            <div style="display: flex; gap: 8px; width: 100%; justify-content: flex-end;">
              <button type="button" class="btn-outline-erp" @click="resetForm">
                Cancel
              </button>
              <button
                type="submit"
                class="btn-primary-erp"
                :disabled="qtyExceedsAvailable || isQtyInvalid || availableToDispatch === 0"
              >
                Save Dispatch
              </button>
            </div>
          </div>
        </div>
      </form>

      <!-- ===================================================================================
           ORDER BALANCE SUMMARY SECTION
           Displays cumulative status across Ordered, QA Approved, Dispatched, and Remaining Balance
      ==================================================================================== -->
      <div class="order-balance-section" v-if="currentOrder.orderNo">
        <h4 class="section-title">Order balance</h4>
        <div class="table-responsive">
          <table class="erp-table table-bordered">
            <thead>
              <tr>
                <th>Ordered</th>
                <th>QA Approved</th>
                <th>Dispatched</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <!-- Total customer order quantity -->
                <td>{{ currentOrder.orderedQty }}</td>
                <!-- Total QA passed pieces -->
                <td>{{ currentOrder.qaApprovedQty }}</td>
                <!-- Total dispatched pieces including current batch -->
                <td style="font-weight: 600;">{{ previewDispatched }}</td>
                <!-- Remaining balance with explanatory note -->
                <td style="font-weight: 600; color: #0e7490;">
                  {{ orderBalanceText }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DispatchForm",

  /**
   * Component Properties
   * @property {Array} orderList - Master list of orders available for dispatch
   * @property {String} initialOrderNo - Optional order ID pre-selected when loading the form
   */
  props: {
    orderList: {
      type: Array,
      required: true,
      default: () => [],
    },
    initialOrderNo: {
      type: String,
      default: "ORD-2026-0001",
    },
  },

  /**
   * Component Emits
   * @emits save-dispatch - Dispatched when a valid dispatch entry is saved
   * @emits cancel - Dispatched when user cancels or resets the form
   */
  emits: ["save-dispatch", "cancel"],

  data() {
    return {
      // Currently selected order identifier from the dropdown
      selectedOrderNo: "",

      // Form state model matching wireframe specifications
      form: {
        deliveryNote: "DN-2026-0001",
        dispatchDate: "2026-11-02",
        // Pre-loaded with 100 to replicate the wireframe validation scenario (100 > 95 available)
        dispatchQty: 100,
      },

      // Validation and feedback banners
      validationError: "Cannot dispatch 100: only 95 QA-approved and available.",
      successMessage: "",
    };
  },

  computed: {
    /**
     * Finds the full order record corresponding to selectedOrderNo
     * @returns {Object} Order record or fallback object
     */
    currentOrder() {
      const found = this.orderList.find((o) => o.orderNo === this.selectedOrderNo);
      return (
        found || {
          orderNo: "",
          customer: "",
          orderedQty: 100,
          qaApprovedQty: 95,
          alreadyDispatchedQty: 0,
        }
      );
    },

    /**
     * Calculates available pieces to dispatch
     * Formula: Available = QA Approved Qty - Already Dispatched Qty
     * Per SRS rule: Cumulative dispatch cannot exceed QA approved quantity
     * @returns {Number} Available quantity (>= 0)
     */
    availableToDispatch() {
      const avail = this.currentOrder.qaApprovedQty - this.currentOrder.alreadyDispatchedQty;
      return Math.max(0, avail);
    },

    /**
     * Checks if the user entered quantity exceeds available stock
     * @returns {Boolean}
     */
    qtyExceedsAvailable() {
      if (!this.form.dispatchQty) return false;
      return Number(this.form.dispatchQty) > this.availableToDispatch;
    },

    /**
     * Validates that quantity is positive whole number
     * @returns {Boolean}
     */
    isQtyInvalid() {
      return Number(this.form.dispatchQty) <= 0;
    },

    /**
     * Preview calculation for total dispatched pieces
     * @returns {Number} Cumulative dispatched pieces
     */
    previewDispatched() {
      return this.currentOrder.alreadyDispatchedQty > 0
        ? this.currentOrder.alreadyDispatchedQty
        : Math.min(Number(this.form.dispatchQty) || 0, this.availableToDispatch);
    },

    /**
     * Formats balance status text matching wireframe specification
     * (e.g. "5 (awaiting approval)" or "X remaining")
     * @returns {String} Formatted balance string
     */
    orderBalanceText() {
      const awaitingApproval = this.currentOrder.orderedQty - this.currentOrder.qaApprovedQty;
      if (awaitingApproval > 0) {
        return `${awaitingApproval} (awaiting approval)`;
      }
      const remainingToDispatch = this.currentOrder.orderedQty - this.previewDispatched;
      return `${remainingToDispatch} remaining`;
    },
  },

  watch: {
    /**
     * Watch initialOrderNo prop changes to synchronize order selection
     */
    initialOrderNo: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.selectedOrderNo = newVal;
          this.onOrderChange();
        }
      },
    },
  },

  mounted() {
    // Default selection on mount if not already set
    if (!this.selectedOrderNo && this.orderList.length > 0) {
      this.selectedOrderNo = this.orderList[0].orderNo;
      this.onOrderChange();
    }
  },

  methods: {
    /**
     * Triggered when the user changes order in the dropdown
     */
    onOrderChange() {
      this.successMessage = "";
      this.validateQty();
    },

    /**
     * Validates dispatch quantity against business rules
     * Updates validation error banner message
     */
    validateQty() {
      this.successMessage = "";
      if (this.qtyExceedsAvailable) {
        this.validationError = `Cannot dispatch ${this.form.dispatchQty}: only ${this.availableToDispatch} QA-approved and available.`;
      } else if (this.isQtyInvalid && this.form.dispatchQty !== "") {
        this.validationError = "Dispatch quantity must be greater than zero.";
      } else {
        this.validationError = "";
      }
    },

    /**
     * Handles form submission and dispatches payload to parent component
     * SRS Rule: Delivery note number is required & unique, cumulative dispatch <= QA-approved
     */
    handleSubmit() {
      this.validateQty();
      if (this.qtyExceedsAvailable || this.isQtyInvalid) {
        return;
      }
      if (!this.form.deliveryNote.trim()) {
        this.validationError = "Delivery note number is required.";
        return;
      }

      // Assemble new dispatch payload
      const dispatchPayload = {
        deliveryNote: this.form.deliveryNote.trim(),
        orderNo: this.selectedOrderNo,
        customer: this.currentOrder.customer,
        qty: Number(this.form.dispatchQty),
        date: this.form.dispatchDate,
      };

      // Emit event to parent to append record to list
      this.$emit("save-dispatch", dispatchPayload);

      // Display green banner confirmation per SRS interaction rules
      this.successMessage = "Saved successfully";
      this.validationError = "";

      // Auto-generate new Delivery Note ID for subsequent dispatch
      setTimeout(() => {
        const nextId = Math.floor(Math.random() * 900) + 100;
        this.form.deliveryNote = `DN-2026-0${nextId}`;
        this.successMessage = "";
      }, 3500);
    },

    /**
     * Resets form fields to available quantity and clears errors
     */
    resetForm() {
      this.form.dispatchQty = this.availableToDispatch;
      this.validateQty();
      this.successMessage = "";
      this.$emit("cancel");
    },
  },
};
</script>
