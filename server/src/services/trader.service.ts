import { prisma } from "../config/prisma";
import { recalculateAccount } from "./portfolio.service";
import type { OrderStatus, OrderType, Prisma } from "@prisma/client";

type DbClient = typeof prisma | Prisma.TransactionClient;

function normaliseSymbol(symbol: string) {
  return symbol.trim().toUpperCase();
}

function toNumber(value: unknown) {
  const numberValue = Number(value);

  if (!Number.isFinite(numberValue)) {
    throw new Error("Invalid numeric value");
  }

  return numberValue;
}

function serializeOrder(order: {
  id: string;
  userId: string;
  symbol: string;
  type: OrderType;
  quantity: unknown;
  price: unknown;
  status: OrderStatus;
  createdAt: Date;
  user?: {
    id: string;
    email: string;
    fullName: string;
  } | null;
}) {
  return {
    id: order.id,
    userId: order.userId,
    symbol: normaliseSymbol(order.symbol),
    type: order.type,
    quantity: toNumber(order.quantity),
    price: toNumber(order.price),
    status: order.status,
    createdAt: order.createdAt,
    user: order.user
      ? {
          id: order.user.id,
          email: order.user.email,
          fullName: order.user.fullName,
        }
      : null,
  };
}

export async function listPendingOrders() {
  const orders = await prisma.order.findMany({
    where: {
      status: "PENDING",
    },
    orderBy: {
      createdAt: "asc",
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          fullName: true,
        },
      },
    },
  });

  return orders.map(serializeOrder);
}

export async function fillOrder(orderId: string) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
      },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    if (order.status !== "PENDING") {
      throw new Error("Only pending orders can be filled");
    }

    const quantity = toNumber(order.quantity);
    const price = toNumber(order.price);

    if (quantity <= 0) {
      throw new Error("Order quantity must be greater than zero");
    }

    if (price <= 0) {
      throw new Error("Order price must be greater than zero");
    }

    const tradeValue = Number((quantity * price).toFixed(2));

    const account = await tx.account.findUnique({
      where: {
        userId: order.userId,
      },
    });

    if (!account) {
      throw new Error("Customer account not found");
    }

    const symbol = normaliseSymbol(order.symbol);

    if (order.type === "BUY") {
      const cashBalance = toNumber(account.cashBalance);

      if (cashBalance < tradeValue) {
        throw new Error(
          "Insufficient customer cash balance to fill this buy order",
        );
      }

      const existingHolding = await tx.holding.findUnique({
        where: {
          userId_symbol: {
            userId: order.userId,
            symbol,
          },
        },
      });

      if (existingHolding) {
        const oldQuantity = toNumber(existingHolding.quantity);
        const oldAvgPrice = toNumber(existingHolding.avgPrice);

        const newQuantity = oldQuantity + quantity;

        const newAvgPrice =
          newQuantity === 0
            ? 0
            : (oldQuantity * oldAvgPrice + quantity * price) /
              newQuantity;

        await tx.holding.update({
          where: {
            id: existingHolding.id,
          },
          data: {
            quantity: newQuantity,
            avgPrice: newAvgPrice,
            currentPrice: price,
          },
        });
      } else {
        await tx.holding.create({
          data: {
            userId: order.userId,
            symbol,
            quantity,
            avgPrice: price,
            currentPrice: price,
            marketValue: tradeValue,
            profitLoss: 0,
          },
        });
      }

      await tx.account.update({
        where: {
          userId: order.userId,
        },
        data: {
          cashBalance: Number(
            (cashBalance - tradeValue).toFixed(2),
          ),
        },
      });
    } else {
      const existingHolding = await tx.holding.findUnique({
        where: {
          userId_symbol: {
            userId: order.userId,
            symbol,
          },
        },
      });

      if (!existingHolding) {
        throw new Error("Customer does not own this stock");
      }

      const currentQuantity = toNumber(existingHolding.quantity);

      if (currentQuantity < quantity) {
        throw new Error(
          "Insufficient holding quantity to fill this sell order",
        );
      }

      const remainingQuantity = currentQuantity - quantity;
      const cashBalance = toNumber(account.cashBalance);

      if (remainingQuantity <= 0) {
        await tx.holding.delete({
          where: {
            id: existingHolding.id,
          },
        });
      } else {
        await tx.holding.update({
          where: {
            id: existingHolding.id,
          },
          data: {
            quantity: remainingQuantity,
            currentPrice: price,
          },
        });
      }

      await tx.account.update({
        where: {
          userId: order.userId,
        },
        data: {
          cashBalance: Number(
            (cashBalance + tradeValue).toFixed(2),
          ),
        },
      });
    }

    const updatedOrder = await tx.order.update({
      where: {
        id: order.id,
      },
      data: {
        status: "FILLED",
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
      },
    });

    await recalculateAccount(
      order.userId,
      tx,
      {
        syncCashBalance: false,
      },
    );

    return serializeOrder(updatedOrder);
  });
}

export async function cancelOrder(orderId: string) {
  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.status !== "PENDING") {
    throw new Error("Only pending orders can be cancelled");
  }

  const updatedOrder = await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      status: "CANCELLED",
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          fullName: true,
        },
      },
    },
  });

  return serializeOrder(updatedOrder);
}