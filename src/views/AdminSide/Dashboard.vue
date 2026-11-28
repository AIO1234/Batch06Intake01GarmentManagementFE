<!-- =========================================================================================
  Garment Manufacturing ERP - Central Dashboard View
  File: src/views/AdminSide/Dashboard.vue
  Reference: UI Design Document Page 3 (Screen · Dashboard / Landing Page)
  Purpose:
    - Central internal landing dashboard showing operational overview across manufacturing:
      1) KPI metric summary cards (Open orders, POs awaiting goods, Low stock, Unpaid invoices)
      2) Order pipeline progress tracking (Ordered, Produced, QA approved, Dispatched, Invoiced)
      3) Quick Action shortcuts into core student functions (including + Dispatch)
      4) Recent Orders table with real-time status badges
      5) Complete manufacturing business process flow visualization
========================================================================================== -->

<template>
  <div class="dashboard-container">
    <!-- ===================================================================================
         SECTION 1: KPI METRIC CARDS
         Summarizes key metrics across orders, purchasing, inventory, and finance
    ==================================================================================== -->
    <div class="kpi-grid">
      <!-- KPI 1: Open Orders -->
      <div class="kpi-card">
        <div class="kpi-value text-primary">24</div>
        <div class="kpi-label">Open orders</div>
      </div>

      <!-- KPI 2: POs Awaiting Goods -->
      <div class="kpi-card">
        <div class="kpi-value text-accent">9</div>
        <div class="kpi-label">POs awaiting goods</div>
      </div>

      <!-- KPI 3: Materials Low in Stock -->
      <div class="kpi-card">
        <div class="kpi-value text-error">3</div>
        <div class="kpi-label">Materials low in stock</div>
      </div>

      <!-- KPI 4: Unpaid Invoices -->
      <div class="kpi-card">
        <div class="kpi-value text-warning">5</div>
        <div class="kpi-label">Unpaid invoices</div>
      </div>
    </div>

    <!-- ===================================================================================
         SECTION 2: PIPELINE PROGRESS & QUICK ACTIONS
    ==================================================================================== -->
    <div class="dashboard-grid">
      <!-- 2.1 Order Pipeline Progress (Quantities) -->
      <div class="erp-card">
        <div class="card-header-bar">
          <h3 class="card-title">Order pipeline (qty)</h3>
        </div>
        <div class="card-body">
          <div class="pipeline-list">
            <!-- Stage 1: Ordered -->
            <div class="pipeline-item">
              <div class="item-meta">
                <span>Ordered</span>
                <span class="qty-badge">100</span>
              </div>
              <div class="bar-track">
                <div class="bar-fill fill-blue" style="width: 100%;"></div>
              </div>
            </div>

            <!-- Stage 2: Produced -->
            <div class="pipeline-item">
              <div class="item-meta">
                <span>Produced</span>
                <span class="qty-badge">100</span>
              </div>
              <div class="bar-track">
                <div class="bar-fill fill-sky" style="width: 100%;"></div>
              </div>
            </div>

            <!-- Stage 3: QA Approved -->
            <div class="pipeline-item">
              <div class="item-meta">
                <span>QA approved</span>
                <span class="qty-badge">95</span>
              </div>
              <div class="bar-track">
                <div class="bar-fill fill-amber" style="width: 95%;"></div>
              </div>
            </div>

            <!-- Stage 4: Dispatched (Student 10 Focus) -->
            <div class="pipeline-item">
              <div class="item-meta">
                <span>Dispatched</span>
                <span class="qty-badge">95</span>
              </div>
              <div class="bar-track">
                <div class="bar-fill fill-green" style="width: 95%;"></div>
              </div>
            </div>

            <!-- Stage 5: Invoiced -->
            <div class="pipeline-item">
              <div class="item-meta">
                <span>Invoiced</span>
                <span class="qty-badge">95</span>
              </div>
              <div class="bar-track">
                <div class="bar-fill fill-purple" style="width: 95%;"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 2.2 Quick Action Buttons -->
      <div class="erp-card">
        <div class="card-header-bar">
          <h3 class="card-title">Quick actions</h3>
        </div>
        <div class="card-body">
          <div class="quick-actions-list">
            <button class="action-tile" @click="$router.push('/orders')">
              <span class="plus">+</span> New Order
            </button>
            <button class="action-tile" @click="$router.push('/purchase-orders')">
              <span class="plus">+</span> New PO
            </button>
            <button class="action-tile" @click="$router.push('/grn')">
              <span class="plus">+</span> Receive GRN
            </button>
            <button class="action-tile" @click="$router.push('/production')">
              <span class="plus">+</span> Record Production
            </button>
            <!-- Highlighted Dispatch action leading directly to Function 10 -->
            <button class="action-tile highlight-action" @click="$router.push('/dispatch')">
              <span class="plus">+</span> Dispatch
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ===================================================================================
         SECTION 3: RECENT ORDERS TABLE
         Displays current status of sample active orders
    ==================================================================================== -->
    <div class="erp-card">
      <div class="card-header-bar">
        <h3 class="card-title">Recent orders</h3>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="erp-table">
            <thead>
              <tr>
                <th>Order No.</th>
                <th>Customer</th>
                <th>Qty</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="font-weight: 600; color: #0e7490;">ORD-2026-0001</td>
                <td>ABC Apparels</td>
                <td>100</td>
                <td><span class="status-badge status-qa">QA</span></td>
              </tr>
              <tr>
                <td style="font-weight: 600; color: #0e7490;">ORD-2026-0002</td>
                <td>Fashion Hub</td>
                <td>250</td>
                <td><span class="status-badge status-in-production">In Production</span></td>
              </tr>
              <tr>
                <td style="font-weight: 600; color: #0e7490;">ORD-2026-0003</td>
                <td>Urban Wear</td>
                <td>80</td>
                <td><span class="status-badge status-pending">Pending</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ===================================================================================
         SECTION 4: BUSINESS PROCESS FLOW
         SRS §7: Customer ➔ Order ➔ BOM/PO ➔ GRN ➔ Stock ➔ Production ➔ QA ➔ Dispatch ➔ Invoice
    ==================================================================================== -->
    <div class="erp-card">
      <div class="card-header-bar">
        <h3 class="card-title">Business flow</h3>
      </div>
      <div class="card-body">
        <div class="flow-container">
          <span class="flow-node">Customer</span>
          <span class="flow-arrow">➔</span>
          <span class="flow-node">Order</span>
          <span class="flow-arrow">➔</span>
          <span class="flow-node">BOM / PO</span>
          <span class="flow-arrow">➔</span>
          <span class="flow-node">GRN</span>
          <span class="flow-arrow">➔</span>
          <span class="flow-node">Stock</span>
          <span class="flow-arrow">➔</span>
          <span class="flow-node">Production</span>
          <span class="flow-arrow">➔</span>
          <span class="flow-node">QA</span>
          <span class="flow-arrow">➔</span>
          <span class="flow-node active-node">Dispatch</span>
          <span class="flow-arrow">➔</span>
          <span class="flow-node">Invoice</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DashboardView",
};
</script>

<style lang="scss" scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  .kpi-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 18px 20px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);

    .kpi-value {
      font-size: 28px;
      font-weight: 800;
      line-height: 1.1;
      margin-bottom: 6px;

      &.text-primary { color: #0e7490; }
      &.text-accent { color: #0284c7; }
      &.text-error { color: #dc2626; }
      &.text-warning { color: #d97706; }
    }

    .kpi-label {
      font-size: 12px;
      font-weight: 600;
      color: #64748b;
    }
  }
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1.6fr 1.2fr;
  gap: 18px;

  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
  }
}

.pipeline-list {
  display: flex;
  flex-direction: column;
  gap: 14px;

  .pipeline-item {
    display: flex;
    flex-direction: column;
    gap: 4px;

    .item-meta {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      font-weight: 600;
      color: #475569;

      .qty-badge {
        font-weight: 700;
        color: #12303b;
      }
    }

    .bar-track {
      height: 8px;
      background-color: #f1f5f9;
      border-radius: 4px;
      overflow: hidden;

      .bar-fill {
        height: 100%;
        border-radius: 4px;

        &.fill-blue { background-color: #2563eb; }
        &.fill-sky { background-color: #0284c7; }
        &.fill-amber { background-color: #f59e0b; }
        &.fill-green { background-color: #16a34a; }
        &.fill-purple { background-color: #9333ea; }
      }
    }
  }
}

.quick-actions-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  .action-tile {
    flex: 1 1 calc(50% - 10px);
    background: #0e7490;
    color: #ffffff;
    border: none;
    border-radius: 4px;
    padding: 10px 14px;
    font-size: 12.5px;
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    justify-content: center;
    transition: background 0.15s;

    &:hover {
      background: #0c6077;
    }

    &.highlight-action {
      background: #0b1f27;
      border: 1px solid #0e7490;

      &:hover {
        background: #0e7490;
      }
    }

    .plus {
      font-size: 14px;
      font-weight: bold;
    }
  }
}

.flow-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  font-size: 12px;

  .flow-node {
    padding: 5px 10px;
    background: #f1f5f9;
    border: 1px solid #cbd5e1;
    border-radius: 4px;
    font-weight: 600;
    color: #334155;

    &.active-node {
      background: #0e7490;
      color: #ffffff;
      border-color: #0e7490;
    }
  }

  .flow-arrow {
    color: #94a3b8;
    font-size: 11px;
  }
}
</style>
