<!-- =========================================================================================
  Function 10: Dispatch Management - View Wrapper
  File: src/views/AdminSide/Dispatch Management/index.vue
  Student: Student 10 Deliverable (SRS v1.4 §6 & §8, UI Wireframe Page 14)
  Purpose:
    - Root route component mounted by Vue Router for /dispatch and /admin/dispatch.
    - Imports and renders DispatchManagementMain from the Components directory.
========================================================================================== -->

<template>
  <DispatchManagementMain />
</template>

<script>
import DispatchManagementMain from "./Components/index.vue";

export default {
  name: "DispatchManagementView",
  components: {
    DispatchManagementMain,
  },
};
</script>
