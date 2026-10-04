import { Router } from "express";

import {
  login,
  register,
} from "../controllers/auth.controller";

import { me } from "../controllers/me.controller";

import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.post("/register", register);

router.post("/login", login);

router.get(
  "/me",
  requireAuth,
  me,
);

export default router;
