<template>
  <div class="dispatch-container">
    <!-- View Switcher Tabs (Matches UI Wireframe Deliverables) -->
    <div class="view-tabs">
      <button
        class="view-tab-btn"
        :class="{ active: currentTab === 'split' }"
        @click="currentTab = 'split'"
      >
        <span>📑</span> Full Wireframe View (Screen A + B)
      </button>
      <button
        class="view-tab-btn"
        :class="{ active: currentTab === 'screenA' }"
        @click="currentTab = 'screenA'"
      >
        <span>📦</span> Screen A · Dispatches
      </button>
      <button
        class="view-tab-btn"
        :class="{ active: currentTab === 'screenB' }"
        @click="currentTab = 'screenB'"
      >
        <span>📊</span> Screen B · Report: Dispatch Summary
      </button>
    </div>

    <!-- 1. SPLIT VIEW (Matches Page 14 & Uploaded PNG side-by-side) -->
    <div v-if="currentTab === 'split'" class="split-view-grid">
      <!-- Left Column: Screen A -->
      <div class="split-col">
        <div class="screen-sub-badge">SCREEN A · DISPATCHES</div>
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

      <!-- Right Column: Screen B -->
      <div class="split-col">
        <div class="screen-sub-badge">SCREEN B · REPORT: DISPATCH SUMMARY</div>
        <DispatchReport
          :dispatches="dispatches"
          :order-list="orders"
        />
      </div>
    </div>

    <!-- 2. SCREEN A ONLY -->
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

    <!-- 3. SCREEN B ONLY -->
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
      currentTab: "split",
      selectedOrderForForm: "ORD-2026-0001",
      // Master orders aligned with SRS v1.4 & PDF wireframe scenarios
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
      // Initial dispatches matching wireframe Page 14
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
    this.recalculateDispatchedQty();
  },
  methods: {
    recalculateDispatchedQty() {
      this.orders.forEach((order) => {
        const total = this.dispatches
          .filter((d) => d.orderNo === order.orderNo)
          .reduce((sum, d) => sum + Number(d.qty || 0), 0);
        order.alreadyDispatchedQty = total;
      });
    },
    handleSaveDispatch(newDispatch) {
      this.dispatches.unshift(newDispatch);
      this.recalculateDispatchedQty();
    },
    handleSelectOrder(orderNo) {
      this.selectedOrderForForm = orderNo;
      this.scrollToForm();
    },
    handleCancelForm() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
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
