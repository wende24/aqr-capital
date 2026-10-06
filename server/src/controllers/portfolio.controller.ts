import type { Request, Response } from "express";
import { getCustomerPortfolio } from "../services/portfolio.service";

export async function getMyPortfolio(
  req: Request,
  res: Response,
) {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const portfolio =
      await getCustomerPortfolio(req.userId);

    return res.json({
      success: true,
      data: portfolio,
    });
  } catch (error) {
    console.error(
      "Get my portfolio error:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to load portfolio",
    });
  }
}