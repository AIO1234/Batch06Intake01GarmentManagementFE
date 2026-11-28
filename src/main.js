/**
 * =========================================================================================
 * Garment Manufacturing ERP - Client Entry Point
 * File: src/main.js
 * Student Project · SRS v1.4 Deliverable
 * Purpose:
 *   - Bootstraps the Vue 3 application instance.
 *   - Registers Vuetify 3, Vue Router, and shared mixins.
 *   - Loads the Shared Design System SCSS stylesheets in priority order.
 *   - Mounts the root component to the DOM (#app).
 * =========================================================================================
 */

// Import shared application mixins
import commonmixins from "./Mixins/commonmixins";

// Import plugin registrations (Vuetify, router, fonts)
import { registerPlugins } from "@/plugins";

// =========================================================================================
// STYLESHEET IMPORTS (Shared Design System: SRS §6 & §8)
// =========================================================================================
// 1. Vuetify settings and variable overrides
import "@/styles/settings.scss";

// 2. Fixed sidebar styling with dark slate theme (#12303b)
import "@/assets/scss/sidebar.scss";

// 3. Main admin layout, topbar, and viewport grid
import "@/assets/scss/admin.scss";

// 4. Global helper styles, form elements, and button utilities
import "@/assets/scss/global_styles.scss";

// 5. Function 10: Dispatch Management component styles (#0e7490 primary)
import "@/assets/scss/dispatch.scss";

// 6. User management module styling
import "@/assets/scss/user_management.scss";

// Root Component
import App from "./App.vue";

// Vue 3 Composition API
import { createApp } from "vue";

// Instantiate Vue Application
const app = createApp(App);

// Register global common mixins
app.mixin(commonmixins);

// Register Vuetify, Vue Router, and other configured plugins
registerPlugins(app);

// Mount application to DOM
app.mount("#app");
