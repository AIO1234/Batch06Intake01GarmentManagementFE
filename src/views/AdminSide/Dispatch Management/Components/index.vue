<template>
  <div class="dispatch-container">
    <!-- View Navigation Tabs (Switch between Screen A and Screen B as shown in UI Wireframes) -->
    <div class="view-tabs">
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

    <!-- SCREEN A · DISPATCHES -->
    <div v-show="currentTab === 'screenA'">
      <!-- 1. Dispatches List Table -->
      <DispatchList
        :dispatches="dispatches"
        @open-form="scrollToForm"
        @delete-dispatch="handleDeleteDispatch"
        @select-order="handleSelectOrder"
      />

      <!-- 2. Dispatch QA-Approved Garments Form (Wireframe Page 14) -->
      <div ref="dispatchFormSection">
        <DispatchForm
          :order-list="orders"
          :initial-order-no="selectedOrderForForm"
          @save-dispatch="handleSaveDispatch"
          @cancel="handleCancelForm"
        />
      </div>
    </div>

    <!-- SCREEN B · REPORT: DISPATCH SUMMARY -->
    <div v-show="currentTab === 'screenB'">
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
      currentTab: "screenA",
      selectedOrderForForm: "ORD-2026-0001",
      // Master orders aligned with SRS v1.4 and PDF wireframe scenarios
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
    // Check if initial dispatch applies to alreadyDispatchedQty
    this.recalculateDispatchedQty();
  },
  methods: {
    recalculateDispatchedQty() {
      // Sum dispatched quantities per order
      this.orders.forEach((order) => {
        const total = this.dispatches
          .filter((d) => d.orderNo === order.orderNo)
          .reduce((sum, d) => sum + Number(d.qty || 0), 0);
        order.alreadyDispatchedQty = total;
      });
    },
    handleSaveDispatch(newDispatch) {
      // Add to dispatches list (or prepend)
      this.dispatches.unshift(newDispatch);
      this.recalculateDispatchedQty();
    },
    handleDeleteDispatch(dispatchToDelete) {
      this.dispatches = this.dispatches.filter(
        (d) => d.deliveryNote !== dispatchToDelete.deliveryNote
      );
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
