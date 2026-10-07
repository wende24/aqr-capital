import { Router } from "express";
import { getMarketOverviewController } from "../controllers/market.controller";

const router = Router();

router.get(
  "/overview",
  getMarketOverviewController,
);

export default router;
