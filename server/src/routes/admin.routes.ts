import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/admin.middleware";
import {
  getAdminCustomerPortfolio,
  listCustomers,
  removeCustomerHolding,
  updateCustomerCapital,
  updateCustomerHolding,
} from "../controllers/admin-portfolio.controller";
import {
  getPendingTraderOrders,
  fillTraderOrder,
  cancelTraderOrder,
} from "../controllers/trader.controller";

const router = Router();

router.use(requireAuth);
router.use(requireAdmin);

// Customer portfolio management
router.get("/customers", listCustomers);
router.get("/customers/:userId/portfolio", getAdminCustomerPortfolio);
router.put("/customers/:userId/capital", updateCustomerCapital);
router.put("/customers/:userId/holdings", updateCustomerHolding);
router.delete("/customers/:userId/holdings/:symbol", removeCustomerHolding);

// Admin order execution
router.get("/orders/pending", getPendingTraderOrders);
router.post("/orders/:orderId/fill", fillTraderOrder);
router.post("/orders/:orderId/cancel", cancelTraderOrder);

export default router;