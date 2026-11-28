<!-- =========================================================================================
  Function 10: Dispatch Management - Screen A Dispatches List Component
  File: src/views/AdminSide/Dispatch Management/Components/DispatchList.vue
  Student: Student 10 Deliverable (SRS v1.4 §6 & §8, UI Wireframe Page 14)
  Purpose:
    - Lists all recorded dispatches with Delivery Note, Order Number, Quantity, and Date.
    - Provides real-time instant search filtering across delivery notes and order IDs.
    - Features "+ New Dispatch" action button and interactive row selection.
========================================================================================== -->

<template>
  <div class="erp-card">
    <!-- Card Header -->
    <div class="card-header-bar">
      <h3 class="card-title">Dispatches</h3>
    </div>

    <div class="card-body">
      <!-- ===================================================================================
           SEARCH & ACTION BAR
           Per SRS §8: Search input filters the table as you type
      ==================================================================================== -->
      <div class="search-action-bar">
        <!-- Search bar with magnifying glass icon -->
        <div class="search-input-wrapper">
          <span class="search-icon">🔍</span>
          <input
            type="text"
            v-model="searchQuery"
            class="search-input"
            placeholder="Search delivery note / order..."
          />
        </div>

        <!-- Action Button: Opens / scrolls to the dispatch entry form -->
        <div class="action-btn-group">
          <button class="btn-primary-erp" @click="$emit('open-form')">
            <span>+</span> New Dispatch
          </button>
        </div>
      </div>

      <!-- ===================================================================================
           DISPATCHES LIST TABLE
           Dark table header (#12303b), clear columns, and hoverable interactive rows
      ==================================================================================== -->
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
            <!-- Empty state when no records match filter -->
            <tr v-if="filteredDispatches.length === 0">
              <td colspan="4" style="text-align: center; padding: 20px; color: #94a3b8;">
                No dispatches found. Click "+ New Dispatch" to record a delivery note.
              </td>
            </tr>

            <!-- Table Rows: Clicking a row selects the corresponding order in the form -->
            <tr
              v-for="item in filteredDispatches"
              :key="item.deliveryNote"
              style="cursor: pointer;"
              @click="handleSelect(item)"
              title="Click to select order in dispatch form"
            >
              <!-- Delivery Note Identifier (Styled in Primary Teal #0e7490) -->
              <td style="font-weight: 600; color: #0e7490;">
                {{ item.deliveryNote }}
              </td>
              <!-- Order Identifier -->
              <td>{{ item.orderNo }}</td>
              <!-- Dispatched Quantity -->
              <td style="font-weight: 600;">{{ item.qty }}</td>
              <!-- Dispatch Date (ISO YYYY-MM-DD) -->
              <td>{{ item.date }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ===================================================================================
           TABLE FOOTER & SUMMARY
           Displays item count and total dispatched pieces count
      ==================================================================================== -->
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

  /**
   * Component Properties
   * @property {Array} dispatches - List of all recorded dispatch objects
   */
  props: {
    dispatches: {
      type: Array,
      required: true,
      default: () => [],
    },
  },

  /**
   * Component Emits
   * @emits open-form - Emitted when user clicks "+ New Dispatch"
   * @emits select-order - Emitted when user clicks a row to load that order into the form
   */
  emits: ["open-form", "select-order"],

  data() {
    return {
      // Search query string bound to search input
      searchQuery: "",
    };
  },

  computed: {
    /**
     * Filters dispatches list dynamically as the user types
     * Matches against delivery note identifier or order number
     * @returns {Array} Filtered dispatches
     */
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

    /**
     * Calculates total quantity of all currently filtered dispatches
     * @returns {Number} Sum of piece quantities
     */
    totalDispatchedCount() {
      return this.filteredDispatches.reduce((sum, d) => sum + Number(d.qty || 0), 0);
    },
  },

  methods: {
    /**
     * Selects an order and notifies parent component
     * @param {Object} item - Selected dispatch item
     */
    handleSelect(item) {
      this.$emit("select-order", item.orderNo);
    },
  },
};
</script>
