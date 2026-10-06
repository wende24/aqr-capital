import type { Request, Response } from "express";
import { prisma } from "../config/prisma";
import {
  deleteCustomerHolding,
  getCustomerPortfolio,
  recalculateAccount,
  setCustomerCapital,
  setCustomerHolding,
} from "../services/portfolio.service";

export async function listCustomers(
  _req: Request,
  res: Response,
) {
  try {
    const customers =
      await prisma.user.findMany({
        where: {
          role: "CUSTOMER",
        },
        select: {
          id: true,
          username: true,
          email: true,
          fullName: true,
          createdAt: true,
          role: true,
          account: {
            select: {
              accountType: true,
              capital: true,
              cashBalance: true,
              totalValue: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    return res.json({
      success: true,
      data: customers,
    });
  } catch (error) {
    console.error(
      "List customers error:",
      error,
    );

    return res.status(500).json({
      success: false,
      message: "Failed to load customers",
    });
  }
}

export async function getAdminCustomerPortfolio(
  req: Request,
  res: Response,
) {
  try {
    const userId = String(
      req.params.userId,
    );

    const user =
      await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          username: true,
          email: true,
          fullName: true,
          role: true,
        },
      });

    if (
      !user ||
      user.role !== "CUSTOMER"
    ) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    const portfolio =
      await getCustomerPortfolio(userId);

    return res.json({
      success: true,
      data: {
        user,
        portfolio,
      },
    });
  } catch (error) {
    console.error(
      "Get admin portfolio error:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to load customer portfolio",
    });
  }
}

export async function updateCustomerCapital(
  req: Request,
  res: Response,
) {
  try {
    const userId = String(
      req.params.userId,
    );

    const user =
      await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          role: true,
        },
      });

    if (
      !user ||
      user.role !== "CUSTOMER"
    ) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    const capital = Number(
      req.body.capital,
    );

    const cashBalance =
      req.body.cashBalance ===
      undefined
        ? undefined
        : Number(
            req.body.cashBalance,
          );

    if (
      !Number.isFinite(capital) ||
      capital < 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Capital must be a valid non-negative number",
      });
    }

    if (
      cashBalance !== undefined &&
      (!Number.isFinite(
        cashBalance,
      ) ||
        cashBalance < 0)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Cash balance must be a valid non-negative number",
      });
    }

    await setCustomerCapital(
      userId,
      {
        capital,
        cashBalance,
      },
    );

    await recalculateAccount(
      userId,
    );

    const portfolio =
      await getCustomerPortfolio(
        userId,
      );

    return res.json({
      success: true,
      message:
        "Customer capital updated",
      data: portfolio,
    });
  } catch (error) {
    console.error(
      "Update capital error:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update customer capital",
    });
  }
}

export async function updateCustomerHolding(
  req: Request,
  res: Response,
) {
  try {
    const userId = String(
      req.params.userId,
    );

    const user =
      await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          role: true,
        },
      });

    if (
      !user ||
      user.role !== "CUSTOMER"
    ) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    const symbol = String(
      req.body.symbol ?? "",
    )
      .trim()
      .toUpperCase();

    const quantity = Number(
      req.body.quantity,
    );

    const avgPrice = Number(
      req.body.avgPrice,
    );

    const currentPrice = Number(
      req.body.currentPrice,
    );

    if (!symbol) {
      return res.status(400).json({
        success: false,
        message: "Symbol is required",
      });
    }

    if (
      !Number.isFinite(quantity) ||
      quantity < 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Quantity must be a valid non-negative number",
      });
    }

    if (
      !Number.isFinite(avgPrice) ||
      avgPrice < 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Average price must be a valid non-negative number",
      });
    }

    if (
      !Number.isFinite(
        currentPrice,
      ) ||
      currentPrice < 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Current price must be a valid non-negative number",
      });
    }

    await setCustomerHolding(
      userId,
      {
        symbol,
        quantity,
        avgPrice,
        currentPrice,
      },
    );

    await recalculateAccount(
      userId,
    );

    const portfolio =
      await getCustomerPortfolio(
        userId,
      );

    return res.json({
      success: true,
      message:
        "Customer holding updated",
      data: portfolio,
    });
  } catch (error) {
    console.error(
      "Update holding error:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update customer holding",
    });
  }
}

export async function removeCustomerHolding(
  req: Request,
  res: Response,
) {
  try {
    const userId = String(
      req.params.userId,
    );

    const symbol = String(
      req.params.symbol,
    )
      .trim()
      .toUpperCase();

    await deleteCustomerHolding(
      userId,
      symbol,
    );

    await recalculateAccount(
      userId,
    );

    const portfolio =
      await getCustomerPortfolio(
        userId,
      );

    return res.json({
      success: true,
      message:
        "Customer holding removed",
      data: portfolio,
    });
  } catch (error) {
    console.error(
      "Remove holding error:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to remove customer holding",
    });
  }
}