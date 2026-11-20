<template>
  <div>
    <v-container>
      <div class="mt-10"></div>

      <v-card class="pa-5" elevation="3">
        <!-- data table of inspection records -->
        <v-data-table :items="items" :headers="headers" :loading="loading">
        </v-data-table>
      </v-card>
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [],
      loading: false,

      headers: [
        { title: "Date", value: "date" },
        { title: "Order", value: "order" },
        { title: "Inspected", value: "inspected" },
        { title: "Approved", value: "approved" },
        { title: "Defective", value: "defective" },
        { title: "Rework", value: "rework" },
      ],
    };
  },
};
</script>
