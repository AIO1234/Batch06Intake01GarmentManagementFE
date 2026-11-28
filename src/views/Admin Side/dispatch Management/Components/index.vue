<!-- =========================================================================================
  Function 10: Dispatch Management - Path Compatibility Components Wrapper
  File: src/views/Admin Side/dispatch Management/Components/index.vue
  Student: Student 10 Deliverable (SRS v1.4 §6 & §8, UI Wireframe Page 14)
  Purpose:
    - Provides backward and casing compatibility for imports referencing:
      "src/views/Admin Side/dispatch Management/Components/index.vue".
========================================================================================== -->

<template>
  <DispatchManagementMain />
</template>

<script>
import DispatchManagementMain from "@/views/AdminSide/Dispatch Management/Components/index.vue";

export default {
  name: "DispatchManagementComponentsWrapper",
  components: {
    DispatchManagementMain,
  },
};
</script>
