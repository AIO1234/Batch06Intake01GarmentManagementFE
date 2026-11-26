import Home from "./modules/home";
import Users from "./modules/users";
import WebSite from "./modules/userside_routes";
import Product from "./modules/product";

import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [...Home, ...Users, ...WebSite,...Product],
});

export default router;
