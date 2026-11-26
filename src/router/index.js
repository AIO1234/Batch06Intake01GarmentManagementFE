import Home from "./modules/home";
import Users from "./modules/users";
import WebSite from "./modules/userside_routes";
import Product from "./modules/product";
import rawmaterial from "./modules/rawmaterial_routes";
// imported QA route
import QualityAssurance from "./modules/qualityassurance";

// Composables
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  //QA Route
  routes: [...Home, ...Users, ...WebSite, ...Product, ...rawmaterial, ...QualityAssurance],
});

export default router;
