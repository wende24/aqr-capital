import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes";
import adminRoutes from "./routes/admin.routes";
import portfolioRoutes from "./routes/portfolio.routes";
import marketRoutes from "./routes/market.routes";
import traderRoutes from "./routes/trader.routes";
import orderRoutes from "./routes/order.routes";

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "AQR Capital backend is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/market", marketRoutes);
app.use("/api/trader", traderRoutes);
app.use("/api/orders", orderRoutes);

export default app;