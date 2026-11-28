<!-- =========================================================================================
  Function 10: Dispatch Management - Screen B Report Component
  File: src/views/AdminSide/Dispatch Management/Components/DispatchReport.vue
  Student: Student 10 Deliverable (SRS v1.4 §6 & §8, UI Wireframe Page 14)
  Purpose:
    - Generates the Dispatch Summary Report with date range and order filters.
    - Provides CSV data export functionality with real client-side file download.
    - Displays pagination and summary counters aligned with the UI wireframe specifications.
========================================================================================== -->

<template>
  <div class="erp-card">
    <!-- Card Header -->
    <div class="card-header-bar">
      <h3 class="card-title">Dispatch Summary</h3>
    </div>

    <div class="card-body">
      <!-- ===================================================================================
           REPORT FILTER BAR
           Per SRS §8 interaction rules: Every report has filters + table + Export CSV button
      ==================================================================================== -->
      <div class="report-filter-bar">
        <!-- Filter 1: Order Dropdown (All orders or specific order) -->
        <div class="filter-item">
          <label>Order</label>
          <select v-model="filterOrder" class="filter-input">
            <option value="">All orders</option>
            <option
              v-for="order in orderList"
              :key="order.orderNo"
              :value="order.orderNo"
            >
              {{ order.orderNo }}
            </option>
          </select>
        </div>

        <!-- Filter 2: From Date Input -->
        <div class="filter-item">
          <label>From</label>
          <input type="date" v-model="filterFrom" class="filter-input" />
        </div>

        <!-- Filter 3: To Date Input -->
        <div class="filter-item">
          <label>To</label>
          <input type="date" v-model="filterTo" class="filter-input" />
        </div>

        <!-- Filter Action Buttons: Apply Filter, Reset, and Export CSV -->
        <div class="filter-actions">
          <button class="btn-primary-erp" @click="applyFilters">
            Apply Filter
          </button>
          <button class="btn-outline-erp" @click="resetFilters">
            Reset
          </button>
          <!-- Amber Export CSV Button (#f59e0b) matching shared design system standards -->
          <button class="btn-export-erp" @click="exportCSV">
            <span>⬇</span> Export CSV
          </button>
        </div>
      </div>

      <!-- ===================================================================================
           REPORT DISPATCHES TABLE
           Displays filtered records with Delivery Note, Order ID, Quantity, and Date
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
            <!-- Empty state when no records match applied filters -->
            <tr v-if="paginatedDispatches.length === 0">
              <td colspan="4" style="text-align: center; padding: 24px; color: #94a3b8;">
                No dispatch records match the selected filters.
              </td>
            </tr>
            <!-- Report table rows -->
            <tr v-for="item in paginatedDispatches" :key="item.deliveryNote">
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

      <!-- ===================================================================================
           TABLE FOOTER, TOTAL DISPATCHED COUNTER & PAGINATION
           Matches Screen B footer: "Showing 1–1 of 1", "Total dispatched: 95", Prev / Next
      ==================================================================================== -->
      <div class="table-footer">
        <!-- Showing entries count -->
        <div>
          Showing {{ paginatedDispatches.length > 0 ? (currentPage - 1) * pageSize + 1 : 0 }}–{{
            Math.min(currentPage * pageSize, filteredList.length)
          }}
          of {{ filteredList.length }}
        </div>

        <!-- Total Dispatched Quantity Counter -->
        <div class="total-dispatched">
          Total dispatched: {{ totalDispatched }}
        </div>

        <!-- Pagination Controls -->
        <div class="pagination-controls">
          <button
            class="page-btn"
            :disabled="currentPage <= 1"
            @click="currentPage--"
          >
            ‹ Prev
          </button>
          <button
            v-for="p in totalPages"
            :key="p"
            class="page-btn"
            :class="{ active: p === currentPage }"
            @click="currentPage = p"
          >
            {{ p }}
          </button>
          <button
            class="page-btn"
            :disabled="currentPage >= totalPages"
            @click="currentPage++"
          >
            Next ›
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DispatchReport",

  /**
   * Component Properties
   * @property {Array} dispatches - Source array of all dispatch records
   * @property {Array} orderList - Available customer orders for filter dropdown
   */
  props: {
    dispatches: {
      type: Array,
      required: true,
      default: () => [],
    },
    orderList: {
      type: Array,
      required: true,
      default: () => [],
    },
  },

  data() {
    return {
      // Pending filter inputs bound to form controls
      filterOrder: "",
      filterFrom: "2026-11-01",
      filterTo: "2026-11-30",

      // Currently active applied filters (committed on clicking "Apply Filter")
      activeFilterOrder: "",
      activeFilterFrom: "2026-11-01",
      activeFilterTo: "2026-11-30",

      // Pagination state
      currentPage: 1,
      pageSize: 5,
    };
  },

  computed: {
    /**
     * Filters dispatches based on active order and date range criteria
     * @returns {Array} Filtered list of dispatches
     */
    filteredList() {
      return this.dispatches.filter((d) => {
        // Filter by Order identifier if specified
        if (this.activeFilterOrder && d.orderNo !== this.activeFilterOrder) {
          return false;
        }
        // Filter by From date threshold
        if (this.activeFilterFrom && d.date < this.activeFilterFrom) {
          return false;
        }
        // Filter by To date threshold
        if (this.activeFilterTo && d.date > this.activeFilterTo) {
          return false;
        }
        return true;
      });
    },

    /**
     * Sums total dispatched quantities across all filtered items
     * @returns {Number} Sum of quantities
     */
    totalDispatched() {
      return this.filteredList.reduce((sum, item) => sum + Number(item.qty || 0), 0);
    },

    /**
     * Calculates total pages for pagination
     * @returns {Number} Page count
     */
    totalPages() {
      return Math.max(1, Math.ceil(this.filteredList.length / this.pageSize));
    },

    /**
     * Slices the filtered list according to the active page
     * @returns {Array} Paginated subset of dispatches
     */
    paginatedDispatches() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.filteredList.slice(start, start + this.pageSize);
    },
  },

  methods: {
    /**
     * Commits pending filter inputs to active filters and resets to page 1
     */
    applyFilters() {
      this.activeFilterOrder = this.filterOrder;
      this.activeFilterFrom = this.filterFrom;
      this.activeFilterTo = this.filterTo;
      this.currentPage = 1;
    },

    /**
     * Resets all filters back to default date range (Nov 2026) and clears order filter
     */
    resetFilters() {
      this.filterOrder = "";
      this.filterFrom = "2026-11-01";
      this.filterTo = "2026-11-30";
      this.activeFilterOrder = "";
      this.activeFilterFrom = "2026-11-01";
      this.activeFilterTo = "2026-11-30";
      this.currentPage = 1;
    },

    /**
     * Exports currently filtered dispatch records to CSV format
     * Creates an in-memory CSV file and triggers a browser download
     */
    exportCSV() {
      if (this.filteredList.length === 0) {
        alert("No dispatch records to export.");
        return;
      }

      // Define standard CSV column headers
      const headers = ["Delivery Note", "Order", "Quantity", "Dispatch Date"];

      // Map rows to escaped CSV values
      const rows = this.filteredList.map((item) => [
        `"${item.deliveryNote}"`,
        `"${item.orderNo}"`,
        item.qty,
        `"${item.date}"`,
      ]);

      // Combine headers and rows
      const csvContent =
        "data:text/csv;charset=utf-8," +
        [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

      // Generate downloadable link and trigger click
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute(
        "download",
        `dispatch_summary_${new Date().toISOString().slice(0, 10)}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
  },
};
</script>
