<template>
  <div class="erp-card">
    <div class="card-header-bar">
      <h3 class="card-title">Dispatches</h3>
    </div>
    <div class="card-body">
      <!-- Search and New Dispatch Action Bar -->
      <div class="search-action-bar">
        <div class="search-input-wrapper">
          <span class="search-icon">🔍</span>
          <input
            type="text"
            v-model="searchQuery"
            class="search-input"
            placeholder="Search delivery note / order..."
          />
        </div>
        <div class="action-btn-group">
          <button class="btn-primary-erp" @click="$emit('open-form')">
            <span>+</span> New Dispatch
          </button>
        </div>
      </div>

      <!-- Dispatches List Table -->
      <div class="table-responsive">
        <table class="erp-table">
          <thead>
            <tr>
              <th>Delivery Note</th>
              <th>Order</th>
              <th>Qty</th>
              <th>Date</th>
              <th style="text-align: right;">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredDispatches.length === 0">
              <td colspan="5" style="text-align: center; padding: 24px; color: #94a3b8;">
                No dispatches found. Click "+ New Dispatch" to record a delivery note.
              </td>
            </tr>
            <tr v-for="item in filteredDispatches" :key="item.deliveryNote">
              <td style="font-weight: 600; color: #0e7490;">
                {{ item.deliveryNote }}
              </td>
              <td>{{ item.orderNo }}</td>
              <td style="font-weight: 600;">{{ item.qty }}</td>
              <td>{{ item.date }}</td>
              <td style="text-align: right;">
                <button
                  class="btn-outline-erp"
                  style="padding: 4px 10px; font-size: 11.5px; margin-right: 6px;"
                  @click="viewDetails(item)"
                  title="View Delivery Note"
                >
                  View
                </button>
                <button
                  class="btn-outline-erp"
                  style="padding: 4px 10px; font-size: 11.5px; color: #dc2626; border-color: #fca5a5;"
                  @click="confirmDelete(item)"
                  title="Delete Dispatch"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Table count -->
      <div class="table-footer">
        <div>Showing 1–{{ filteredDispatches.length }} of {{ filteredDispatches.length }}</div>
        <div class="total-dispatched">Total Dispatched: {{ totalDispatchedCount }} pcs</div>
      </div>
    </div>

    <!-- Confirm Delete Modal (SRS interaction rule: delete only through confirmation dialog) -->
    <div
      v-if="itemToDelete"
      class="modal-backdrop-custom"
      style="position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000;"
    >
      <div style="background: white; border-radius: 8px; width: 420px; max-width: 90%; padding: 22px; box-shadow: 0 10px 25px rgba(0,0,0,0.15);">
        <h4 style="margin-top: 0; color: #12303b; font-size: 16px;">Confirm Deletion</h4>
        <p style="font-size: 13.5px; color: #475569; margin: 12px 0 20px 0;">
          Are you sure you want to delete delivery note <strong>{{ itemToDelete.deliveryNote }}</strong> for order <strong>{{ itemToDelete.orderNo }}</strong>?
        </p>
        <div style="display: flex; justify-content: flex-end; gap: 10px;">
          <button class="btn-outline-erp" @click="itemToDelete = null">Cancel</button>
          <button class="btn-primary-erp" style="background-color: #dc2626;" @click="executeDelete">
            Delete Record
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DispatchList",
  props: {
    dispatches: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  emits: ["open-form", "delete-dispatch", "select-order"],
  data() {
    return {
      searchQuery: "",
      itemToDelete: null,
    };
  },
  computed: {
    filteredDispatches() {
      if (!this.searchQuery.trim()) {
        return this.dispatches;
      }
      const q = this.searchQuery.toLowerCase().trim();
      return this.dispatches.filter(
        (d) =>
          (d.deliveryNote && d.deliveryNote.toLowerCase().includes(q)) ||
          (d.orderNo && d.orderNo.toLowerCase().includes(q))
      );
    },
    totalDispatchedCount() {
      return this.filteredDispatches.reduce((sum, d) => sum + Number(d.qty || 0), 0);
    },
  },
  methods: {
    viewDetails(item) {
      this.$emit("select-order", item.orderNo);
    },
    confirmDelete(item) {
      this.itemToDelete = item;
    },
    executeDelete() {
      if (this.itemToDelete) {
        this.$emit("delete-dispatch", this.itemToDelete);
        this.itemToDelete = null;
      }
    },
  },
};
</script>
