<template>
  <div class="dispatch-container">
    <div class="erp-card">
      <div class="card-header-bar">
        <h3 class="card-title">{{ moduleTitle }} & Form</h3>
      </div>
      <div class="card-body">
        <div class="search-action-bar">
          <div class="search-input-wrapper">
            <span class="search-icon">🔍</span>
            <input
              type="text"
              class="search-input"
              :placeholder="`Search ${moduleTitle.toLowerCase()}...`"
            />
          </div>
          <div class="action-btn-group">
            <button class="btn-primary-erp">
              <span>+</span> Add {{ singularName }}
            </button>
          </div>
        </div>

        <div class="table-responsive">
          <table class="erp-table">
            <thead>
              <tr>
                <th v-for="col in columns" :key="col">{{ col }}</th>
                <th style="text-align: right;">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, idx) in sampleRows" :key="idx">
                <td
                  v-for="(val, cIdx) in row"
                  :key="cIdx"
                  :style="cIdx === 0 ? 'font-weight: 600; color: #0e7490;' : ''"
                >
                  {{ val }}
                </td>
                <td style="text-align: right;">
                  <button class="btn-outline-erp" style="padding: 4px 10px; font-size: 11.5px;">
                    Edit
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="table-footer">
          <div>Showing 1–{{ sampleRows.length }} of {{ sampleRows.length }}</div>
          <div>Student Wireframe Deliverable · SRS §8</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ModulePlaceholder",
  computed: {
    moduleTitle() {
      return this.$route.meta?.pageTitle || "Garment ERP Module";
    },
    singularName() {
      const title = this.moduleTitle;
      if (title.endsWith("s")) return title.slice(0, -1);
      return title;
    },
    columns() {
      switch (this.$route.path) {
        case "/customers":
          return ["Code", "Name", "Contact Person", "Phone", "Address"];
        case "/orders":
          return ["Order No.", "Date", "Customer", "Style", "Qty", "Delivery", "Status"];
        case "/suppliers":
          return ["Code", "Name", "Contact Person", "Phone", "Address"];
        case "/purchase-orders":
          return ["PO No.", "Supplier", "Material", "Ordered", "Received", "Outstanding", "Status"];
        case "/materials-bom":
          return ["Code", "Name", "Unit", "Per-unit Qty", "Status"];
        case "/grn":
          return ["GRN No.", "PO No.", "Material", "Received", "Date"];
        case "/stock":
          return ["Material", "Receipts", "Issues", "Available Balance"];
        case "/production":
          return ["Date", "Order", "Cut Qty", "Completed", "Materials Used", "Wastage"];
        case "/qa":
          return ["Date", "Order", "Inspected", "Approved", "Defective", "Rework"];
        case "/invoices":
          return ["Invoice No.", "Date", "Customer", "Qty", "Amount (LKR)", "Status"];
        default:
          return ["Code", "Description", "Date", "Status"];
      }
    },
    sampleRows() {
      switch (this.$route.path) {
        case "/customers":
          return [
            ["CUS-0001", "ABC Apparels", "R. Perera", "077 123 4567", "12 Galle Rd, Colombo"],
            ["CUS-0002", "Fashion Hub", "S. Fernando", "071 555 8899", "45 Main St, Kandy"],
            ["CUS-0003", "Urban Wear", "N. Silva", "076 222 3344", "8 Beach Rd, Negombo"],
          ];
        case "/orders":
          return [
            ["ORD-2026-0001", "2026-10-01", "ABC Apparels", "Polo Shirt M Blue", "100", "2026-11-15", "QA"],
            ["ORD-2026-0002", "2026-10-03", "Fashion Hub", "T-Shirt L White", "250", "2026-11-30", "In Production"],
            ["ORD-2026-0003", "2026-10-10", "Urban Wear", "Jogger S Grey", "80", "2026-12-05", "Pending"],
          ];
        case "/suppliers":
          return [
            ["SUP-0001", "Lanka Fabrics (Pvt) Ltd", "D. Wijesinghe", "011 234 5678", "Pettah, Colombo 11"],
            ["SUP-0002", "Thread & Trim Co.", "A. Kumar", "077 889 1100", "Ja-Ela"],
            ["SUP-0003", "Button World", "F. Nazeer", "071 300 2255", "Maradana, Colombo 10"],
          ];
        case "/purchase-orders":
          return [
            ["PO-2026-0001", "Lanka Fabrics", "Cotton Fabric (m)", "150", "150", "0", "Closed"],
            ["PO-2026-0002", "Button World", "Buttons (pcs)", "600", "300", "300", "Partial"],
            ["PO-2026-0003", "Thread & Trim Co.", "Thread (cones)", "40", "0", "40", "Open"],
          ];
        case "/materials-bom":
          return [
            ["MAT-001", "Cotton Fabric", "metre", "1.20", "Active"],
            ["MAT-002", "Buttons", "pcs", "4", "Active"],
            ["MAT-003", "Thread", "cone", "0.05", "Active"],
          ];
        case "/grn":
          return [
            ["GRN-2026-0001", "PO-2026-0001", "Cotton Fabric", "150", "2026-10-12"],
            ["GRN-2026-0002", "PO-2026-0002", "Buttons", "300", "2026-10-15"],
          ];
        case "/stock":
          return [
            ["Cotton Fabric (m)", "150.00", "120.00", "30.00"],
            ["Buttons (pcs)", "300", "300", "0"],
            ["Thread (cone)", "40", "5.00", "35.00"],
          ];
        case "/production":
          return [
            ["2026-10-27", "ORD-2026-0001", "105", "60", "Cotton 72 m", "5"],
            ["2026-10-28", "ORD-2026-0001", "0", "40", "Cotton 48 m", "0"],
          ];
        case "/qa":
          return [
            ["2026-10-30", "ORD-2026-0001", "100", "95", "5", "0"],
          ];
        case "/invoices":
          return [
            ["INV-2026-0001", "2026-11-03", "ABC Apparels", "95", "137,750.00", "Unpaid"],
            ["INV-2025-0099", "2026-09-28", "Fashion Hub", "200", "196,000.00", "Paid"],
          ];
        default:
          return [["REC-001", "Sample Record", "2026-11-01", "Active"]];
      }
    },
  },
};
</script>
