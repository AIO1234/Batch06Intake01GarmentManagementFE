import Home from "./modules/home";
import Users from "./modules/users";
import Orders from "./modules/orders";
import WebSite from "./modules/userside_routes";

import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [...Home, ...Users, ...Orders, ...WebSite],
});

export default router;
