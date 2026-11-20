<template>
  <div>
    <div class="text-right">
      <div class="pa-5">
        <!-- button to add a new inspection -->
        <v-btn color="primary" class="add_button">
          <span class="text">Add New Inspection</span>
        </v-btn>
      </div>
    </div>

    <InspectionTable />
  </div>
</template>

<!-- import inspection table component -->
<script>
import InspectionTable from "@/views/AdminSide/QualityAssurance/Components/Table.vue";

export default {
  components: {
    InspectionTable,
  },

  data() {
    return {};
  },

  methods: {},
};
</script>
