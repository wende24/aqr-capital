import { prisma } from "../config/prisma";
import type { OrderType } from "@prisma/client";

function normaliseSymbol(symbol: string) {
  return symbol.trim().toUpperCase();
}

function toPositiveNumber(value: unknown, fieldName: string) {
  const numberValue = Number(value);

  if (!Number.isFinite(numberValue) || numberValue <= 0) {
    throw new Error(`${fieldName} must be greater than zero`);
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
  status: string;
  createdAt: Date;
}) {
  return {
    id: order.id,
    userId: order.userId,
    symbol: normaliseSymbol(order.symbol),
    type: order.type,
    quantity: Number(order.quantity),
    price: Number(order.price),
    status: order.status,
    createdAt: order.createdAt,
  };
}

export async function createCustomerOrder(
  userId: string,
  input: {
    symbol: string;
    type: OrderType;
    quantity: number;
    price: number;
  },
) {
  const symbol = normaliseSymbol(input.symbol);

  if (!symbol) {
    throw new Error("Symbol is required");
  }

  if (input.type !== "BUY" && input.type !== "SELL") {
    throw new Error("Order type must be BUY or SELL");
  }

  const quantity = toPositiveNumber(
    input.quantity,
    "Quantity",
  );

  const price = toPositiveNumber(
    input.price,
    "Price",
  );

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      role: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.role !== "CUSTOMER") {
    throw new Error("Only customers can submit orders");
  }

  const account = await prisma.account.findUnique({
    where: {
      userId,
    },
    select: {
      id: true,
    },
  });

  if (!account) {
    throw new Error("Customer account not found");
  }

  const order = await prisma.order.create({
    data: {
      userId,
      symbol,
      type: input.type,
      quantity,
      price,
      status: "PENDING",
    },
  });

  return serializeOrder(order);
}

export async function listCustomerOrders(userId: string) {
  const orders = await prisma.order.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return orders.map(serializeOrder);
}