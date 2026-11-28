<!-- =========================================================================================
  Function 10: Dispatch Management - Master Orchestrator Component
  File: src/views/AdminSide/Dispatch Management/Components/index.vue
  Student: Student 10 Deliverable (SRS v1.4 §6 & §8, UI Wireframe Page 14)
  Purpose:
    - Central container managing state for orders, dispatches, and active view tabs.
    - Provides flexible viewing modes:
      1) Full Wireframe View: Displays Screen A and Screen B side-by-side (matches Page 14 PNG)
      2) Screen A Only: Focused view for recording & viewing dispatches
      3) Screen B Only: Focused view for Dispatch Summary reporting & CSV export
========================================================================================== -->

<template>
  <div class="dispatch-container">
    <!-- ===================================================================================
         VIEW NAVIGATION TABS
         Allows switching between Split Wireframe View, Screen A only, and Screen B only
    ==================================================================================== -->
    <div class="view-tabs">
      <!-- Tab 1: Full Wireframe View (Side-by-side view exactly matching uploaded PNG) -->
      <button
        class="view-tab-btn"
        :class="{ active: currentTab === 'split' }"
        @click="currentTab = 'split'"
      >
        <span>📑</span> Full Wireframe View (Screen A + B)
      </button>

      <!-- Tab 2: Screen A · Dispatches -->
      <button
        class="view-tab-btn"
        :class="{ active: currentTab === 'screenA' }"
        @click="currentTab = 'screenA'"
      >
        <span>📦</span> Screen A · Dispatches
      </button>

      <!-- Tab 3: Screen B · Report: Dispatch Summary -->
      <button
        class="view-tab-btn"
        :class="{ active: currentTab === 'screenB' }"
        @click="currentTab = 'screenB'"
      >
        <span>📊</span> Screen B · Report: Dispatch Summary
      </button>
    </div>

    <!-- ===================================================================================
         VIEW MODE 1: SPLIT VIEW (SCREEN A + SCREEN B SIDE-BY-SIDE)
         Laptop first layout (1366x768+) reproducing Page 14 wireframe deliverable
    ==================================================================================== -->
    <div v-if="currentTab === 'split'" class="split-view-grid">
      <!-- Left Column: Screen A (Dispatches List & QA-Approved Garments Form) -->
      <div class="split-col">
        <div class="screen-sub-badge">SCREEN A · DISPATCHES</div>
        <!-- Screen A List Component -->
        <DispatchList
          :dispatches="dispatches"
          @open-form="scrollToForm"
          @select-order="handleSelectOrder"
        />

        <!-- Screen A Form Component -->
        <div ref="dispatchFormSection">
          <DispatchForm
            :order-list="orders"
            :initial-order-no="selectedOrderForForm"
            @save-dispatch="handleSaveDispatch"
            @cancel="handleCancelForm"
          />
        </div>
      </div>

      <!-- Right Column: Screen B (Report: Dispatch Summary) -->
      <div class="split-col">
        <div class="screen-sub-badge">SCREEN B · REPORT: DISPATCH SUMMARY</div>
        <!-- Screen B Report Component -->
        <DispatchReport
          :dispatches="dispatches"
          :order-list="orders"
        />
      </div>
    </div>

    <!-- ===================================================================================
         VIEW MODE 2: SCREEN A ONLY (FULL WIDTH)
    ==================================================================================== -->
    <div v-else-if="currentTab === 'screenA'">
      <DispatchList
        :dispatches="dispatches"
        @open-form="scrollToForm"
        @select-order="handleSelectOrder"
      />

      <div ref="dispatchFormSection">
        <DispatchForm
          :order-list="orders"
          :initial-order-no="selectedOrderForForm"
          @save-dispatch="handleSaveDispatch"
          @cancel="handleCancelForm"
        />
      </div>
    </div>

    <!-- ===================================================================================
         VIEW MODE 3: SCREEN B ONLY (FULL WIDTH)
    ==================================================================================== -->
    <div v-else-if="currentTab === 'screenB'">
      <DispatchReport
        :dispatches="dispatches"
        :order-list="orders"
      />
    </div>
  </div>
</template>

<script>
import DispatchList from "./DispatchList.vue";
import DispatchForm from "./DispatchForm.vue";
import DispatchReport from "./DispatchReport.vue";

export default {
  name: "DispatchManagementMain",

  components: {
    DispatchList,
    DispatchForm,
    DispatchReport,
  },

  data() {
    return {
      // Default view tab: 'split' displays both Screen A and B side-by-side
      currentTab: "split",

      // Currently highlighted order for form entry
      selectedOrderForForm: "ORD-2026-0001",

      /**
       * Master Orders data aligned with SRS v1.4 and Demo scenario:
       * - ORD-2026-0001: 100 ordered, 95 QA approved (Demo scenario step 7 & 8)
       * - ORD-2026-0002: 250 ordered, 120 QA approved
       * - ORD-2026-0003: 80 ordered, 80 QA approved
       */
      orders: [
        {
          orderNo: "ORD-2026-0001",
          customer: "ABC Apparels",
          style: "Polo Shirt M Blue",
          orderedQty: 100,
          qaApprovedQty: 95,
          alreadyDispatchedQty: 0,
        },
        {
          orderNo: "ORD-2026-0002",
          customer: "Fashion Hub",
          style: "T-Shirt L White",
          orderedQty: 250,
          qaApprovedQty: 120,
          alreadyDispatchedQty: 0,
        },
        {
          orderNo: "ORD-2026-0003",
          customer: "Urban Wear",
          style: "Jogger S Grey",
          orderedQty: 80,
          qaApprovedQty: 80,
          alreadyDispatchedQty: 0,
        },
      ],

      /**
       * Initial dispatches list matching Page 14 wireframe:
       * Delivery Note DN-2026-0001 for order ORD-2026-0001 with 95 pcs
       */
      dispatches: [
        {
          deliveryNote: "DN-2026-0001",
          orderNo: "ORD-2026-0001",
          customer: "ABC Apparels",
          qty: 95,
          date: "2026-11-02",
        },
      ],
    };
  },

  created() {
    // Synchronize cumulative already dispatched amounts with initial records
    this.recalculateDispatchedQty();
  },

  methods: {
    /**
     * Recalculates alreadyDispatchedQty for each order based on current dispatches
     * Ensures cumulative business logic remains strictly synchronized
     */
    recalculateDispatchedQty() {
      this.orders.forEach((order) => {
        const total = this.dispatches
          .filter((d) => d.orderNo === order.orderNo)
          .reduce((sum, d) => sum + Number(d.qty || 0), 0);
        order.alreadyDispatchedQty = total;
      });
    },

    /**
     * Handles saving a newly submitted dispatch from DispatchForm
     * Prepends the new record to the list and recalculates cumulative quantities
     * @param {Object} newDispatch - The newly created dispatch record
     */
    handleSaveDispatch(newDispatch) {
      this.dispatches.unshift(newDispatch);
      this.recalculateDispatchedQty();
    },

    /**
     * Selects an order from the list and focuses the form
     * @param {String} orderNo - Order identifier (e.g. "ORD-2026-0001")
     */
    handleSelectOrder(orderNo) {
      this.selectedOrderForForm = orderNo;
      this.scrollToForm();
    },

    /**
     * Handles form cancellation
     */
    handleCancelForm() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    },

    /**
     * Smoothly scrolls down to the dispatch form section
     */
    scrollToForm() {
      this.$nextTick(() => {
        if (this.$refs.dispatchFormSection) {
          this.$refs.dispatchFormSection.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
/* Responsive 2-column split view grid reproducing Page 14 UI wireframe */
.split-view-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  align-items: start;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}

.split-col {
  min-width: 0;
}

.screen-sub-badge {
  font-size: 11px;
  font-weight: 800;
  color: #0e7490;
  letter-spacing: 0.6px;
  margin-bottom: 8px;
  text-transform: uppercase;
}
</style>
