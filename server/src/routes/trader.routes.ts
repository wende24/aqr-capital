import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { requireTrader } from "../middleware/trader.middleware";
import {
  cancelTraderOrder,
  fillTraderOrder,
  getPendingTraderOrders,
} from "../controllers/trader.controller";

const router = Router();

router.use(requireAuth);
router.use(requireTrader);

router.get(
  "/orders/pending",
  getPendingTraderOrders,
);

router.post(
  "/orders/:orderId/fill",
  fillTraderOrder,
);

router.post(
  "/orders/:orderId/cancel",
  cancelTraderOrder,
);

export default router;