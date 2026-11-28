<!-- =========================================================================================
  Function 10: Dispatch Management - Path Compatibility Wrapper
  File: src/views/Admin Side/dispatch Management/index.vue
  Student: Student 10 Deliverable (SRS v1.4 §6 & §8, UI Wireframe Page 14)
  Purpose:
    - Provides backward and casing compatibility for imports referencing:
      "src/views/Admin Side/dispatch Management/index.vue" (with spaces and lowercase 'd').
    - Re-exports DispatchManagementView from canonical path "@/views/AdminSide/Dispatch Management".
========================================================================================== -->

<template>
  <DispatchManagementView />
</template>

<script>
import DispatchManagementView from "@/views/AdminSide/Dispatch Management/index.vue";

export default {
  name: "DispatchManagementWrapper",
  components: {
    DispatchManagementView,
  },
};
</script>
