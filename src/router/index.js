import Home from "./modules/home";
import Dispatch from "./modules/dispatch";
import GarmentRoutes from "./modules/garment_routes";
import Users from "./modules/users";

import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...Home,
    ...Dispatch,
    ...GarmentRoutes,
    ...Users,
    {
      path: "/:pathMatch(.*)*",
      redirect: "/dispatch",
    },
  ],
});

router.afterEach((to) => {
  if (to.meta?.pageTitle) {
    document.title = `${to.meta.pageTitle} - Garment ERP`;
  }
});

export default router;
