import type { Request, Response } from "express";
import { getMarketOverview } from "../services/market.service";

export function getMarketOverviewController(
  _req: Request,
  res: Response,
) {
  try {
    const markets =
      getMarketOverview();

    return res.status(200).json({
      success: true,
      data: markets,
    });
  } catch (error) {
    console.error(
      "Get market overview error:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to load market overview",
    });
  }
}
