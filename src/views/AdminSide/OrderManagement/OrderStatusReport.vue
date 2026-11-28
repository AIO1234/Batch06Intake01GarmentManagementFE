<template>
  <div class="order_management pa-2">
    <div class="d-flex justify-end mb-3">
      <v-btn
        variant="outlined"
        color="primary"
        prepend-icon="mdi-arrow-left"
        style="text-transform: none"
        @click="$router.push('/OrderManagement')"
      >
        Back to Orders & Styles
      </v-btn>
    </div>

    <OrderStatusReportComponent />
  </div>
</template>

<script>
import OrderStatusReportComponent from "@/views/AdminSide/OrderManagement/Components/OrderStatusReport.vue";

export default {
  name: "OrderStatusReportPage",
  components: {
    OrderStatusReportComponent,
  },
};
</script>
