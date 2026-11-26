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
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredDispatches.length === 0">
              <td colspan="4" style="text-align: center; padding: 20px; color: #94a3b8;">
                No dispatches found. Click "+ New Dispatch" to record a delivery note.
              </td>
            </tr>
            <tr
              v-for="item in filteredDispatches"
              :key="item.deliveryNote"
              style="cursor: pointer;"
              @click="handleSelect(item)"
              title="Click to select order in form"
            >
              <td style="font-weight: 600; color: #0e7490;">
                {{ item.deliveryNote }}
              </td>
              <td>{{ item.orderNo }}</td>
              <td style="font-weight: 600;">{{ item.qty }}</td>
              <td>{{ item.date }}</td>
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
  emits: ["open-form", "select-order"],
  data() {
    return {
      searchQuery: "",
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
    handleSelect(item) {
      this.$emit("select-order", item.orderNo);
    },
  },
};
</script>
