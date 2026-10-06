import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { getMyPortfolio } from "../controllers/portfolio.controller";

const router = Router();

router.use(requireAuth);

router.get("/me", getMyPortfolio);

export default router;