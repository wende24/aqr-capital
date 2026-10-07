import type { Request, Response } from "express";
import { getCustomerPortfolio } from "../services/portfolio.service";

export async function getMyPortfolio(
  req: Request,
  res: Response,
) {
  if (!req.userId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  try {
    const portfolio =
      await getCustomerPortfolio(req.userId);

    return res.status(200).json({
      success: true,
      data: portfolio,
    });
  } catch (error) {
    console.error(
      "Get my portfolio error:",
      error,
    );

    const message =
      error instanceof Error
        ? error.message
        : "Failed to load portfolio";

    if (
      message ===
      "Customer account not found"
    ) {
      return res.status(404).json({
        success: false,
        message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to load portfolio",
    });
  }
}