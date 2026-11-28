<template>
  <div>
    <!-- Quick Add Garment Style -->
    <QuickAddGarmentStyle
      class="mb-4"
      @stylesChanged="$emit('stylesChanged')"
    />

    <!-- Garment Styles Table -->
    <v-card class="pa-4" elevation="2">
      <v-row class="mb-3" dense>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="searchQuery"
            prepend-inner-icon="mdi-magnify"
            placeholder="Search garment style, size, or colour..."
            variant="outlined"
            density="compact"
            hide-details
            clearable
          />
        </v-col>
      </v-row>

      <v-data-table
        class="erp_table"
        :items="filteredStyles"
        :headers="headers"
        :loading="loading"
        :items-per-page="10"
        hover
      >
        <template #[`item.display_label`]="{ item }">
          {{ formatStyle(item) }}
        </template>

        <template #[`item.action`]="{ item }">
          <div class="d-flex ga-2">
            <v-btn
              size="small"
              color="primary"
              variant="tonal"
              style="text-transform: capitalize"
              @click="openEditModal(item)"
            >
              Edit
            </v-btn>
            <v-btn
              size="small"
              color="error"
              variant="tonal"
              style="text-transform: capitalize"
              @click="deleteStyle(item)"
            >
              Delete
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="showEditModal" max-width="500px" persistent>
      <v-card class="pa-2">
        <v-card-title class="d-flex justify-space-between align-center">
          <span class="font-weight-bold">Edit Garment Style</span>
          <v-btn icon variant="text" @click="closeEditModal(false)">
            <v-icon color="primary">mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <UpdateGarmentStyle
            :selected-item="selectedStyle"
            @closeModal="closeEditModal"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import QuickAddGarmentStyle from "@/views/AdminSide/OrderManagement/Components/QuickAddGarmentStyle.vue";
import UpdateGarmentStyle from "@/views/AdminSide/OrderManagement/Components/UpdateGarmentStyle.vue";
import orderService, { formatStyleLabel } from "@/services/orderService";

export default {
  name: "GarmentStyleTable",
  components: {
    QuickAddGarmentStyle,
    UpdateGarmentStyle,
  },

  props: {
    styles: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },

  emits: ["stylesChanged"],

  data() {
    return {
      searchQuery: "",
      showEditModal: false,
      selectedStyle: {},
      headers: [
        { title: "ID", key: "id", width: "80px" },
        { title: "Style Name", key: "style_name" },
        { title: "Size", key: "size" },
        { title: "Colour", key: "colour" },
        { title: "Display Name", key: "display_label" },
        { title: "Action", key: "action", sortable: false },
      ],
    };
  },

  computed: {
    filteredStyles() {
      const q = (this.searchQuery || "").trim().toLowerCase();
      if (!q) return this.styles;
      return this.styles.filter((s) =>
        formatStyleLabel(s).toLowerCase().includes(q)
      );
    },
  },

  methods: {
    formatStyle(item) {
      return formatStyleLabel(item);
    },

    openEditModal(item) {
      this.selectedStyle = { ...item };
      this.showEditModal = true;
    },

    closeEditModal(shouldRefresh = false) {
      this.showEditModal = false;
      if (shouldRefresh) {
        this.$emit("stylesChanged");
      }
    },

    async deleteStyle(item) {
      const result = await Swal.fire({
        icon: "warning",
        title: "Delete Garment Style?",
        text: `Remove "${formatStyleLabel(item)}"?`,
        showCancelButton: true,
        confirmButtonColor: "#d33",
        confirmButtonText: "Yes, delete",
      });

      if (result.isConfirmed) {
        await orderService.deleteGarmentStyle(item.id);
        this.$emit("stylesChanged");
        Swal.fire({
          icon: "success",
          title: "Deleted",
          timer: 1400,
          showConfirmButton: false,
        });
      }
    },
  },
};
</script>
