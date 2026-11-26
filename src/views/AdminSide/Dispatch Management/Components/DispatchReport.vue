<template>
  <div class="erp-card">
    <div class="card-header-bar">
      <h3 class="card-title">Dispatch Summary</h3>
    </div>
    <div class="card-body">
      <!-- Filter Controls (Screen B Wireframe Page 14) -->
      <div class="report-filter-bar">
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

        <div class="filter-item">
          <label>From</label>
          <input type="date" v-model="filterFrom" class="filter-input" />
        </div>

        <div class="filter-item">
          <label>To</label>
          <input type="date" v-model="filterTo" class="filter-input" />
        </div>

        <div class="filter-actions">
          <button class="btn-primary-erp" @click="applyFilters">
            Apply Filter
          </button>
          <button class="btn-outline-erp" @click="resetFilters">
            Reset
          </button>
          <button class="btn-export-erp" @click="exportCSV">
            <span>⬇</span> Export CSV
          </button>
        </div>
      </div>

      <!-- Report Dispatches Table -->
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
            <tr v-if="paginatedDispatches.length === 0">
              <td colspan="4" style="text-align: center; padding: 24px; color: #94a3b8;">
                No dispatch records match the selected filters.
              </td>
            </tr>
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

      <!-- Summary & Pagination Footer -->
      <div class="table-footer">
        <div>
          Showing {{ paginatedDispatches.length > 0 ? (currentPage - 1) * pageSize + 1 : 0 }}–{{
            Math.min(currentPage * pageSize, filteredList.length)
          }}
          of {{ filteredList.length }}
        </div>
        <div class="total-dispatched">
          Total dispatched: {{ totalDispatched }}
        </div>
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
      filterOrder: "",
      filterFrom: "2026-11-01",
      filterTo: "2026-11-30",
      activeFilterOrder: "",
      activeFilterFrom: "2026-11-01",
      activeFilterTo: "2026-11-30",
      currentPage: 1,
      pageSize: 5,
    };
  },
  computed: {
    filteredList() {
      return this.dispatches.filter((d) => {
        // Order filter
        if (this.activeFilterOrder && d.orderNo !== this.activeFilterOrder) {
          return false;
        }
        // From date filter
        if (this.activeFilterFrom && d.date < this.activeFilterFrom) {
          return false;
        }
        // To date filter
        if (this.activeFilterTo && d.date > this.activeFilterTo) {
          return false;
        }
        return true;
      });
    },
    totalDispatched() {
      return this.filteredList.reduce((sum, item) => sum + Number(item.qty || 0), 0);
    },
    totalPages() {
      return Math.max(1, Math.ceil(this.filteredList.length / this.pageSize));
    },
    paginatedDispatches() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.filteredList.slice(start, start + this.pageSize);
    },
  },
  methods: {
    applyFilters() {
      this.activeFilterOrder = this.filterOrder;
      this.activeFilterFrom = this.filterFrom;
      this.activeFilterTo = this.filterTo;
      this.currentPage = 1;
    },
    resetFilters() {
      this.filterOrder = "";
      this.filterFrom = "2026-11-01";
      this.filterTo = "2026-11-30";
      this.activeFilterOrder = "";
      this.activeFilterFrom = "2026-11-01";
      this.activeFilterTo = "2026-11-30";
      this.currentPage = 1;
    },
    exportCSV() {
      if (this.filteredList.length === 0) {
        alert("No dispatch records to export.");
        return;
      }
      const headers = ["Delivery Note", "Order", "Quantity", "Dispatch Date"];
      const rows = this.filteredList.map((item) => [
        `"${item.deliveryNote}"`,
        `"${item.orderNo}"`,
        item.qty,
        `"${item.date}"`,
      ]);

      const csvContent =
        "data:text/csv;charset=utf-8," +
        [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

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
