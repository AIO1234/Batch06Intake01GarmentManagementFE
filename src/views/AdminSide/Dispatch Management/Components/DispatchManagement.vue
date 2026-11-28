<!-- =========================================================================================
  Function 10: Dispatch Management - Legacy Wrapper Component
  File: src/views/AdminSide/Dispatch Management/Components/DispatchManagement.vue
  Student: Student 10 Deliverable (SRS v1.4 §6 & §8, UI Wireframe Page 14)
  Purpose:
    - Provides component export compatibility for existing team imports.
========================================================================================== -->

<template>
  <DispatchManagementMain />
</template>

<script>
import DispatchManagementMain from "./index.vue";

export default {
  name: "DispatchManagement",
  components: {
    DispatchManagementMain,
  },
};
</script>
