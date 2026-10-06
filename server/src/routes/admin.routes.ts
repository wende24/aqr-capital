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

const router = Router();

router.use(requireAuth);
router.use(requireAdmin);

router.get("/customers", listCustomers);

router.get(
  "/customers/:userId/portfolio",
  getAdminCustomerPortfolio,
);

router.put(
  "/customers/:userId/capital",
  updateCustomerCapital,
);

router.put(
  "/customers/:userId/holdings",
  updateCustomerHolding,
);

router.delete(
  "/customers/:userId/holdings/:symbol",
  removeCustomerHolding,
);

export default router;