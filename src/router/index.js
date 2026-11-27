import Home from "./modules/home";
import Dispatch from "./modules/dispatch";
import GarmentRoutes from "./modules/garment_routes";
import Users from "./modules/users";
<<<<<<< HEAD
=======
import WebSite from "./modules/userside_routes";
import Product from "./modules/product";
import rawmaterial from "./modules/rawmaterial_routes";
// imported QA route
import QualityAssurance from "./modules/qualityassurance";
>>>>>>> inuka

// Composables
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

<<<<<<< HEAD
router.afterEach((to) => {
  if (to.meta?.pageTitle) {
    document.title = `${to.meta.pageTitle} - Garment ERP`;
  }
=======
  //QA Route
  routes: [...Home, ...Users, ...WebSite, ...Product, ...rawmaterial, ...QualityAssurance],
>>>>>>> inuka
});

export default router;
