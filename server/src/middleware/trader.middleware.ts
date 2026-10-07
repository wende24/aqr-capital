import type { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma";

export async function requireTrader(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: req.userId,
      },
      select: {
        id: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role !== "TRADER") {
      return res.status(403).json({
        success: false,
        message: "Trader access required",
      });
    }

    next();
  } catch (error) {
    console.error("Trader middleware error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}