<template>
  <div>
    <!-- Add New Inspection Button -->
    <div class="text-right">
      <div class="pa-5">
        <v-btn color="primary" class="add_button" @click="openCreateForm()">
          <span class="text">Add New Inspection</span>
        </v-btn>
      </div>
    </div>

    <!-- Inspection Table -->
    <InspectionTable :items="inspections" />

    <!-- Create Inspection Dialog -->
    <v-dialog v-model="showForm" max-width="600px" persistent>
      <v-card class="form">
        <v-card-title class="d-flex justify-space-between align-center">
          <span class="header">Add New Inspection</span>

          <v-btn icon @click="closeAddForm" class="icon_btn">
            <v-icon color="primary">mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text>
          <CreateInspection
            @saveInspection="saveInspection"
            @closeForm="closeAddForm"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
// import inspection table component
import InspectionTable from "@/views/AdminSide/QualityAssurance/Components/Table.vue";
// import create inspection component
import CreateInspection from "@/views/AdminSide/QualityAssurance/Components/CreateInspection.vue";

export default {
  components: {
    InspectionTable,
    CreateInspection,
  },

  data() {
    return {
      showForm: false,
      // list of saved inspections
      inspections: [],
    };
  },

  methods: {
    // Open create inspection form
    openCreateForm() {
      this.showForm = true;
    },

    // Close create inspection form
    closeAddForm() {
      this.showForm = false;
    },

    // Save inspection details
    saveInspection(inspection) {
      this.inspections.push({ ...inspection });
    },
  },
};
</script>
