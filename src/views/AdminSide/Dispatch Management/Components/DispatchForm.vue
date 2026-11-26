<template>
  <div class="erp-card">
    <div class="card-header-bar">
      <h3 class="card-title">Dispatch QA-approved garments</h3>
    </div>
    <div class="card-body">
      <!-- Validation Error Banner (SRS & Wireframe Page 14) -->
      <div v-if="validationError" class="erp-banner banner-error">
        <span class="banner-icon">⚠️</span>
        <span>{{ validationError }}</span>
      </div>

      <!-- Success Banner -->
      <div v-if="successMessage" class="erp-banner banner-success">
        <span class="banner-icon">✅</span>
        <span>{{ successMessage }}</span>
      </div>

      <!-- Form Inputs Grid -->
      <form @submit.prevent="handleSubmit">
        <!-- Row 1: Order, Dispatch Date, Delivery Note No -->
        <div class="form-grid">
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

        <!-- Row 2: Read-only calculated fields (Ordered, QA Approved, Already Dispatched) -->
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Ordered</label>
            <input
              type="text"
              :value="currentOrder.orderedQty"
              class="form-control readonly-field"
              readonly
            />
          </div>

          <div class="form-group">
            <label class="form-label">QA Approved</label>
            <input
              type="text"
              :value="currentOrder.qaApprovedQty"
              class="form-control readonly-field"
              readonly
            />
          </div>

          <div class="form-group">
            <label class="form-label">Already Dispatched</label>
            <input
              type="text"
              :value="currentOrder.alreadyDispatchedQty"
              class="form-control readonly-field"
              readonly
            />
          </div>
        </div>

        <!-- Row 3: Available to Dispatch & Dispatch Qty -->
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Available to Dispatch</label>
            <input
              type="text"
              :value="availableToDispatch"
              class="form-control readonly-field"
              readonly
            />
          </div>

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
              :max="availableToDispatch"
              @input="validateQty"
              required
            />
            <span v-if="qtyExceedsAvailable" class="invalid-feedback">
              Quantity cannot exceed {{ availableToDispatch }} (QA-approved & available)
            </span>
          </div>

          <!-- Empty slot to balance grid alignment -->
          <div class="form-group" style="visibility: hidden;">
            <label class="form-label">Spacer</label>
            <input type="text" class="form-control" />
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="form-actions">
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
      </form>

      <!-- Order Balance Sub-Section (Wireframe Page 14) -->
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
                <td>{{ currentOrder.orderedQty }}</td>
                <td>{{ currentOrder.qaApprovedQty }}</td>
                <td>{{ previewDispatched }}</td>
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
  emits: ["save-dispatch", "cancel"],
  data() {
    return {
      selectedOrderNo: "",
      form: {
        deliveryNote: "DN-2026-0001",
        dispatchDate: "2026-11-02",
        dispatchQty: 95,
      },
      validationError: "",
      successMessage: "",
    };
  },
  computed: {
    currentOrder() {
      const found = this.orderList.find((o) => o.orderNo === this.selectedOrderNo);
      return (
        found || {
          orderNo: "",
          customer: "",
          orderedQty: 0,
          qaApprovedQty: 0,
          alreadyDispatchedQty: 0,
        }
      );
    },
    availableToDispatch() {
      const avail = this.currentOrder.qaApprovedQty - this.currentOrder.alreadyDispatchedQty;
      return Math.max(0, avail);
    },
    qtyExceedsAvailable() {
      if (!this.form.dispatchQty) return false;
      return Number(this.form.dispatchQty) > this.availableToDispatch;
    },
    isQtyInvalid() {
      return Number(this.form.dispatchQty) <= 0;
    },
    previewDispatched() {
      // Total dispatched after this transaction (or current already dispatched)
      const inputQty = Number(this.form.dispatchQty) || 0;
      return this.currentOrder.alreadyDispatchedQty + (this.qtyExceedsAvailable ? 0 : inputQty);
    },
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
    if (!this.selectedOrderNo && this.orderList.length > 0) {
      this.selectedOrderNo = this.orderList[0].orderNo;
      this.onOrderChange();
    }
  },
  methods: {
    onOrderChange() {
      this.validationError = "";
      this.successMessage = "";
      if (this.currentOrder.orderNo) {
        // Generate a new Delivery Note number if needed
        const randomNum = Math.floor(Math.random() * 900) + 100;
        if (!this.form.deliveryNote || this.form.deliveryNote === "DN-2026-0001") {
          this.form.deliveryNote = `DN-2026-${randomNum}`;
        }
        // Auto-fill suggested dispatch qty up to available
        this.form.dispatchQty = this.availableToDispatch > 0 ? this.availableToDispatch : 0;
      }
      this.validateQty();
    },
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
    handleSubmit() {
      this.validateQty();
      if (this.qtyExceedsAvailable || this.isQtyInvalid) {
        return;
      }
      if (!this.form.deliveryNote.trim()) {
        this.validationError = "Delivery note number is required.";
        return;
      }

      const dispatchPayload = {
        deliveryNote: this.form.deliveryNote.trim(),
        orderNo: this.selectedOrderNo,
        customer: this.currentOrder.customer,
        qty: Number(this.form.dispatchQty),
        date: this.form.dispatchDate,
      };

      this.$emit("save-dispatch", dispatchPayload);
      this.successMessage = "Saved successfully";
      this.validationError = "";

      // Refresh delivery note number for next entry
      setTimeout(() => {
        const nextId = Math.floor(Math.random() * 900) + 100;
        this.form.deliveryNote = `DN-2026-${nextId}`;
        this.successMessage = "";
      }, 4000);
    },
    resetForm() {
      this.validationError = "";
      this.successMessage = "";
      this.$emit("cancel");
    },
  },
};
</script>
