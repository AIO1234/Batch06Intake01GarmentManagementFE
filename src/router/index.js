import Home from "./modules/home";
import Users from "./modules/users";
import WebSite from "./modules/userside_routes";

import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [...Home, ...Users, ...WebSite],
});

export default router;
