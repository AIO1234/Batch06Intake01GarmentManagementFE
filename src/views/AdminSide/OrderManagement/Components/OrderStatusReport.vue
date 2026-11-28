<template>
  <div class="order_management">
    <!-- Filter Bar -->
    <v-card class="pa-4 mb-4 order_form_card" elevation="2">
      <v-row dense class="align-end">
        <v-col cols="12" sm="4" md="3">
          <label class="form_label">Customer</label>
          <v-select
            v-model="draftFilters.customer_id"
            :items="customerOptions"
            item-title="name"
            item-value="id"
            variant="outlined"
            density="compact"
            hide-details
          />
        </v-col>

        <v-col cols="12" sm="4" md="3">
          <label class="form_label">Status</label>
          <v-select
            v-model="draftFilters.status"
            :items="statusOptions"
            variant="outlined"
            density="compact"
            hide-details
          />
        </v-col>

        <v-col
          cols="12"
          sm="4"
          md="6"
          class="d-flex flex-wrap ga-2 justify-md-end mt-2 mt-sm-0"
        >
          <v-btn class="erp_primary_btn" @click="applyFilters">
            Apply Filter
          </v-btn>
          <v-btn variant="outlined" color="grey-darken-1" @click="resetFilters">
            Reset
          </v-btn>
          <v-btn
            class="erp_export_btn"
            prepend-icon="mdi-download"
            :disabled="reportRows.length === 0"
            @click="exportCsv"
          >
            Export CSV
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <!-- Report Table -->
    <v-card class="pa-4" elevation="2">
      <v-data-table
        class="erp_table"
        :items="paginatedRows"
        :headers="headers"
        :loading="loading"
        hide-default-footer
        hover
      >
        <template #[`item.status`]="{ item }">
          <span class="status_badge" :style="badgeStyle(item.status)">
            {{ item.status }}
          </span>
        </template>
      </v-data-table>

      <div class="report_summary_bar mt-4">
        <div>
          <span v-if="reportRows.length > 0">
            Showing {{ startIndex }}-{{ endIndex }} of {{ reportRows.length }}
          </span>
          <span v-else>Showing 0 of 0</span>
        </div>

        <div class="d-flex flex-column align-end ga-2">
          <div class="total_ordered">
            Total ordered: {{ totalOrderedQty.toLocaleString() }}
          </div>
          <v-pagination
            v-if="totalPages > 1"
            v-model="currentPage"
            :length="totalPages"
            density="compact"
            size="small"
            total-visible="5"
          />
        </div>
      </div>
    </v-card>
  </div>
</template>

<script>
import orderService, {
  ORDER_STATUS_FLOW,
  getStatusColor,
} from "@/services/orderService";

export default {
  name: "OrderStatusReportComponent",

  data() {
    return {
      loading: false,
      customers: [],
      reportRows: [],
      currentPage: 1,
      perPage: 10,
      draftFilters: {
        customer_id: "all",
        status: "All",
      },
      appliedFilters: {
        customer_id: "all",
        status: "All",
      },
      headers: [
        { title: "Order No.", key: "order_no" },
        { title: "Date", key: "order_date" },
        { title: "Customer", key: "customer_name" },
        { title: "Ordered Qty", key: "quantity", align: "end" },
        { title: "Status", key: "status" },
      ],
    };
  },

  computed: {
    customerOptions() {
      return [{ id: "all", name: "All customers" }, ...this.customers];
    },

    statusOptions() {
      return ["All", ...ORDER_STATUS_FLOW];
    },

    totalOrderedQty() {
      return this.reportRows.reduce(
        (sum, row) => sum + Number(row.quantity || 0),
        0
      );
    },

    totalPages() {
      return Math.max(1, Math.ceil(this.reportRows.length / this.perPage));
    },

    paginatedRows() {
      const start = (this.currentPage - 1) * this.perPage;
      return this.reportRows.slice(start, start + this.perPage);
    },

    startIndex() {
      if (this.reportRows.length === 0) return 0;
      return (this.currentPage - 1) * this.perPage + 1;
    },

    endIndex() {
      return Math.min(
        this.currentPage * this.perPage,
        this.reportRows.length
      );
    },
  },

  async created() {
    await this.refresh();
  },

  methods: {
    async refresh() {
      this.customers = await orderService.getCustomers();
      await this.loadReport();
    },

    badgeStyle(status) {
      const color = getStatusColor(status);
      return {
        backgroundColor: color.bg,
        color: color.text,
      };
    },

    async loadReport() {
      this.loading = true;
      try {
        this.reportRows = await orderService.getOrderStatusReport(
          this.appliedFilters
        );
        this.currentPage = 1;
      } finally {
        this.loading = false;
      }
    },

    async applyFilters() {
      this.appliedFilters = { ...this.draftFilters };
      await this.loadReport();
    },

    async resetFilters() {
      this.draftFilters = { customer_id: "all", status: "All" };
      this.appliedFilters = { ...this.draftFilters };
      await this.loadReport();
    },

    escapeCsvCell(value) {
      const str = String(value ?? "");
      if (str.includes(",") || str.includes('"') || str.includes("\n")) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    },

    exportCsv() {
      const columns = ["Order No.", "Date", "Customer", "Ordered Qty", "Status"];
      const lines = [columns.join(",")];

      this.reportRows.forEach((row) => {
        lines.push(
          [
            this.escapeCsvCell(row.order_no),
            this.escapeCsvCell(row.order_date),
            this.escapeCsvCell(row.customer_name),
            this.escapeCsvCell(row.quantity),
            this.escapeCsvCell(row.status),
          ].join(",")
        );
      });

      const blob = new Blob([lines.join("\n")], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `order-status-report-${new Date()
        .toISOString()
        .slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
  },
};
</script>
