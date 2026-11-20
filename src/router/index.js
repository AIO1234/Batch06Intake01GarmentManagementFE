import Home from "./modules/home";
import Users from "./modules/users";
import WebSite from "./modules/userside_routes";
// imported QA route
import QualityAssurance from "./modules/qualityassurance";

// Composables
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  //QA Route
  routes: [...Home, ...Users, ...WebSite, ...QualityAssurance],
});

export default router;
