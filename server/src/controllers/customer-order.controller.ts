import type { Request, Response } from "express";
import type { OrderType } from "@prisma/client";
import { createCustomerOrder, listCustomerOrders } from "../services/customer-order.service";

type AuthenticatedRequest = Request & {
  userId?: string;
};

export async function createOrder(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { symbol, type, quantity, price } = req.body;

    const order = await createCustomerOrder(
      req.userId,
      {
        symbol,
        type: type as OrderType,
        quantity,
        price,
      },
    );

    return res.status(201).json({
      success: true,
      message: "Order submitted successfully",
      data: order,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to submit order";

    const status =
      message === "User not found" ||
      message === "Customer account not found"
        ? 404
        : message.includes("Only customers")
          ? 403
          : 400;

    console.error("Create customer order error:", error);

    return res.status(status).json({
      success: false,
      message,
    });
  }
}

export async function getCustomerOrders(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const orders = await listCustomerOrders(req.userId);

    return res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("Get customer orders error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load customer orders",
    });
  }
}