import express from "express";
import cors from "cors";

import adminAuthRoutes from "./routes/admin-auth.routes";
import adminRoutes from "./routes/admin.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/admin-api/health", (_req, res) => {
  return res.json({
    success: true,
    message: "AQR Capital Admin API is running",
  });
});

// 独立 Admin Login
app.use("/admin-api/auth", adminAuthRoutes);

// 独立 Admin business API
app.use("/admin-api", adminRoutes);

app.use((_req, res) => {
  return res.status(404).json({
    success: false,
    message: "Admin route not found",
  });
});

export default app;