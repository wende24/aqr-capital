import { prisma } from "../config/prisma";

type SetCapitalInput = {
  capital: number;
};

type SetHoldingInput = {
  symbol: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
};

function roundMoney(value: number) {
  return Math.round(
    (value + Number.EPSILON) * 100,
  ) / 100;
}

function normaliseSymbol(symbol: string) {
  return symbol.trim().toUpperCase();
}

/**
 * Recalculate all financial values for one customer.
 *
 * Capital:
 *   Amount of money assigned to the customer account.
 *
 * Invested cost:
 *   Sum of quantity × average purchase price.
 *
 * Cash balance:
 *   Capital - invested cost.
 *
 * Investment:
 *   Sum of quantity × current price.
 *
 * Total value:
 *   Cash balance + investment.
 *
 * Earning:
 *   Total value - capital.
 */
export async function recalculateAccount(
  userId: string,
) {
  const account =
    await prisma.account.findUnique({
      where: {
        userId,
      },
    });

  if (!account) {
    throw new Error(
      "Customer account not found",
    );
  }

  const holdings =
    await prisma.holding.findMany({
      where: {
        userId,
      },
    });

  const capital = Number(account.capital);

  let investedCost = 0;
  let investment = 0;

  for (const holding of holdings) {
    const quantity = Number(
      holding.quantity,
    );

    const avgPrice = Number(
      holding.avgPrice,
    );

    const currentPrice = Number(
      holding.currentPrice,
    );

    const marketValue =
      quantity * currentPrice;

    const profitLoss =
      quantity *
      (currentPrice - avgPrice);

    investedCost +=
      quantity * avgPrice;

    investment += marketValue;

    await prisma.holding.update({
      where: {
        id: holding.id,
      },
      data: {
        marketValue,
        profitLoss,
      },
    });
  }

  const roundedInvestedCost =
    roundMoney(investedCost);

  if (roundedInvestedCost > capital) {
    throw new Error(
      `Portfolio cost RM${roundedInvestedCost.toFixed(
        2,
      )} exceeds capital RM${capital.toFixed(2)}`,
    );
  }

  const cashBalance = Math.max(
    0,
    capital - roundedInvestedCost,
  );

  const roundedInvestment =
    roundMoney(investment);

  const totalValue =
    cashBalance + roundedInvestment;

  return prisma.account.update({
    where: {
      userId,
    },
    data: {
      cashBalance,
      totalValue,
    },
  });
}

export async function getCustomerPortfolio(
  userId: string,
) {
  const account =
    await prisma.account.findUnique({
      where: {
        userId,
      },
    });

  const holdings =
    await prisma.holding.findMany({
      where: {
        userId,
      },
      orderBy: {
        symbol: "asc",
      },
    });

  const capital = account
    ? Number(account.capital)
    : 0;

  const cashBalance = account
    ? Number(account.cashBalance)
    : 0;

  const investment =
    holdings.reduce(
      (total, holding) =>
        total +
        Number(holding.marketValue),
      0,
    );

  const totalValue =
    cashBalance + investment;

  const earning =
    totalValue - capital;

  return {
    capital: roundMoney(capital),
    cashBalance: roundMoney(
      cashBalance,
    ),
    investment: roundMoney(
      investment,
    ),
    totalValue: roundMoney(
      totalValue,
    ),
    earning: roundMoney(
      earning,
    ),
    holdings: holdings.map(
      (holding) => ({
        id: holding.id,
        symbol: holding.symbol,
        quantity: Number(
          holding.quantity,
        ),
        avgPrice: Number(
          holding.avgPrice,
        ),
        currentPrice: Number(
          holding.currentPrice,
        ),
        marketValue: Number(
          holding.marketValue,
        ),
        profitLoss: Number(
          holding.profitLoss,
        ),
      }),
    ),
  };
}

export async function setCustomerCapital(
  userId: string,
  input: SetCapitalInput,
) {
  const capital = Math.max(
    0,
    input.capital,
  );

  await prisma.account.upsert({
    where: {
      userId,
    },
    update: {
      capital,
    },
    create: {
      userId,
      accountType: "managed",
      capital,
      cashBalance: capital,
      totalValue: capital,
    },
  });

  return recalculateAccount(
    userId,
  );
}

export async function setCustomerHolding(
  userId: string,
  input: SetHoldingInput,
) {
  const symbol = normaliseSymbol(
    input.symbol,
  );

  const quantity = Math.max(
    0,
    input.quantity,
  );

  const avgPrice = Math.max(
    0,
    input.avgPrice,
  );

  const currentPrice = Math.max(
    0,
    input.currentPrice,
  );

  if (!symbol) {
    throw new Error(
      "Symbol is required",
    );
  }

  const account =
    await prisma.account.findUnique({
      where: {
        userId,
      },
    });

  if (!account) {
    throw new Error(
      "Customer account not found",
    );
  }

  const existingHoldings =
    await prisma.holding.findMany({
      where: {
        userId,
      },
    });

  const existingHolding =
    existingHoldings.find(
      (holding) =>
        holding.symbol ===
        symbol,
    );

  let currentInvestedCost = 0;

  for (const holding of existingHoldings) {
    if (
      existingHolding &&
      holding.id === existingHolding.id
    ) {
      continue;
    }

    currentInvestedCost +=
      Number(holding.quantity) *
      Number(holding.avgPrice);
  }

  const newHoldingCost =
    quantity * avgPrice;

  const newTotalInvestedCost =
    currentInvestedCost +
    newHoldingCost;

  const capital = Number(
    account.capital,
  );

  if (
    roundMoney(
      newTotalInvestedCost,
    ) > capital
  ) {
    throw new Error(
      `Portfolio cost RM${roundMoney(
        newTotalInvestedCost,
      ).toFixed(
        2,
      )} exceeds capital RM${capital.toFixed(
        2,
      )}`,
    );
  }

  const marketValue =
    quantity * currentPrice;

  const profitLoss =
    quantity *
    (currentPrice - avgPrice);

  await prisma.holding.upsert({
    where: {
      userId_symbol: {
        userId,
        symbol,
      },
    },
    update: {
      quantity,
      avgPrice,
      currentPrice,
      marketValue,
      profitLoss,
    },
    create: {
      userId,
      symbol,
      quantity,
      avgPrice,
      currentPrice,
      marketValue,
      profitLoss,
    },
  });

  await recalculateAccount(
    userId,
  );

  return prisma.holding.findUnique({
    where: {
      userId_symbol: {
        userId,
        symbol,
      },
    },
  });
}

export async function deleteCustomerHolding(
  userId: string,
  symbol: string,
) {
  const normalizedSymbol =
    normaliseSymbol(symbol);

  const holding =
    await prisma.holding.findUnique({
      where: {
        userId_symbol: {
          userId,
          symbol: normalizedSymbol,
        },
      },
    });

  if (!holding) {
    throw new Error(
      "Holding not found",
    );
  }

  await prisma.holding.delete({
    where: {
      userId_symbol: {
        userId,
        symbol: normalizedSymbol,
      },
    },
  });

  await recalculateAccount(
    userId,
  );

  return true;
}