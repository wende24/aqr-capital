import type { Request, Response } from "express";
import {
  cancelOrder,
  fillOrder,
  listPendingOrders,
} from "../services/trader.service";

export async function getPendingTraderOrders(
  _req: Request,
  res: Response,
) {
  try {
    const orders = await listPendingOrders();

    return res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error(
      "Get pending trader orders error:",
      error,
    );

    return res.status(500).json({
      success: false,
      message: "Failed to load pending orders",
    });
  }
}

export async function fillTraderOrder(
  req: Request,
  res: Response,
) {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    const order = await fillOrder(orderId);

    return res.json({
      success: true,
      message: "Order filled successfully",
      data: order,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to fill order";

    const status =
      message === "Order not found"
        ? 404
        : message.includes("Only pending")
          ? 409
          : message.includes("Insufficient") ||
              message.includes("does not own")
            ? 400
            : 500;

    console.error(
      "Fill trader order error:",
      error,
    );

    return res.status(status).json({
      success: false,
      message,
    });
  }
}

export async function cancelTraderOrder(
  req: Request,
  res: Response,
) {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    const order = await cancelOrder(orderId);

    return res.json({
      success: true,
      message: "Order cancelled successfully",
      data: order,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to cancel order";

    const status =
      message === "Order not found"
        ? 404
        : message.includes("Only pending")
          ? 409
          : 500;

    console.error(
      "Cancel trader order error:",
      error,
    );

    return res.status(status).json({
      success: false,
      message,
    });
  }
}