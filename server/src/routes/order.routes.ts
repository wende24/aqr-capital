import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import {
  createOrder,
  getCustomerOrders,
} from "../controllers/customer-order.controller";

const router = Router();

router.use(requireAuth);

router.get("/", getCustomerOrders);
router.post("/", createOrder);

export default router;