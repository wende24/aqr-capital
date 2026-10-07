import { prisma } from "../config/prisma";
import type { Prisma } from "@prisma/client";

type SetCapitalInput = {
  capital: number;
};

type SetHoldingInput = {
  symbol: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
};

type RecalculateOptions = {
  syncCashBalance?: boolean;
};

type DbClient =
  | typeof prisma
  | Prisma.TransactionClient;

function roundMoney(value: number) {
  return (
    Math.round(
      (value + Number.EPSILON) * 100,
    ) / 100
  );
}

function normaliseSymbol(symbol: string) {
  return symbol.trim().toUpperCase();
}

function validateNonNegativeNumber(
  value: number,
  fieldName: string,
) {
  if (
    !Number.isFinite(value) ||
    value < 0
  ) {
    throw new Error(
      `${fieldName} must be a valid non-negative number`,
    );
  }

  return value;
}

export async function recalculateAccount(
  userId: string,
  db: DbClient = prisma,
  options: RecalculateOptions = {},
) {
  const account =
    await db.account.findUnique({
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
    await db.holding.findMany({
      where: {
        userId,
      },
      orderBy: {
        symbol: "asc",
      },
    });

  const capital =
    validateNonNegativeNumber(
      Number(account.capital),
      "capital",
    );

  let investedCost = 0;
  let investment = 0;

  for (const holding of holdings) {
    const quantity =
      validateNonNegativeNumber(
        Number(holding.quantity),
        "holding quantity",
      );

    const avgPrice =
      validateNonNegativeNumber(
        Number(holding.avgPrice),
        "holding avgPrice",
      );

    const currentPrice =
      validateNonNegativeNumber(
        Number(holding.currentPrice),
        "holding currentPrice",
      );

    const marketValue =
      roundMoney(
        quantity * currentPrice,
      );

    const profitLoss =
      roundMoney(
        quantity *
          (currentPrice - avgPrice),
      );

    investedCost +=
      quantity * avgPrice;

    investment += marketValue;

    await db.holding.update({
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

  if (
    roundedInvestedCost > capital
  ) {
    throw new Error(
      `Portfolio cost RM${roundedInvestedCost.toFixed(
        2,
      )} exceeds capital RM${capital.toFixed(
        2,
      )}`,
    );
  }

  const roundedInvestment =
    roundMoney(investment);

  let cashBalance =
    validateNonNegativeNumber(
      Number(account.cashBalance),
      "cashBalance",
    );

  if (
    options.syncCashBalance
  ) {
    cashBalance = roundMoney(
      capital -
        roundedInvestedCost,
    );
  }

  const totalValue =
    roundMoney(
      cashBalance +
        roundedInvestment,
    );

  return db.account.update({
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
    ? validateNonNegativeNumber(
        Number(account.capital),
        "capital",
      )
    : 0;

  const cashBalance = account
    ? validateNonNegativeNumber(
        Number(account.cashBalance),
        "cashBalance",
      )
    : 0;

  let investment = 0;

  const calculatedHoldings =
    holdings.map((holding) => {
      const quantity =
        validateNonNegativeNumber(
          Number(holding.quantity),
          "holding quantity",
        );

      const avgPrice =
        validateNonNegativeNumber(
          Number(holding.avgPrice),
          "holding avgPrice",
        );

      const currentPrice =
        validateNonNegativeNumber(
          Number(holding.currentPrice),
          "holding currentPrice",
        );

      const marketValue =
        roundMoney(
          quantity * currentPrice,
        );

      const profitLoss =
        roundMoney(
          quantity *
            (currentPrice - avgPrice),
        );

      investment += marketValue;

      return {
        id: holding.id,
        symbol: holding.symbol,
        quantity,
        avgPrice,
        currentPrice,
        marketValue,
        profitLoss,
      };
    });

  const roundedInvestment =
    roundMoney(investment);

  const totalValue =
    roundMoney(
      cashBalance +
        roundedInvestment,
    );

  const earning =
    roundMoney(
      totalValue - capital,
    );

  return {
    capital,
    cashBalance,
    investment: roundedInvestment,
    totalValue,
    earning,
    holdings:
      calculatedHoldings,
  };
}

export async function setCustomerCapital(
  userId: string,
  input: SetCapitalInput,
) {
  const capital =
    validateNonNegativeNumber(
      input.capital,
      "capital",
    );

  return prisma.$transaction(
    async (tx) => {
      await tx.account.upsert({
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
        tx,
        {
          syncCashBalance: true,
        },
      );
    },
  );
}

export async function setCustomerHolding(
  userId: string,
  input: SetHoldingInput,
) {
  const symbol = normaliseSymbol(
    input.symbol,
  );

  if (!symbol) {
    throw new Error(
      "Symbol is required",
    );
  }

  const quantity =
    validateNonNegativeNumber(
      input.quantity,
      "quantity",
    );

  const avgPrice =
    validateNonNegativeNumber(
      input.avgPrice,
      "avgPrice",
    );

  const currentPrice =
    validateNonNegativeNumber(
      input.currentPrice,
      "currentPrice",
    );

  return prisma.$transaction(
    async (tx) => {
      const account =
        await tx.account.findUnique({
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
        await tx.holding.findMany({
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

      for (
        const holding of
          existingHoldings
      ) {
        if (
          existingHolding &&
          holding.id ===
            existingHolding.id
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
        roundMoney(
          currentInvestedCost +
            newHoldingCost,
        );

      const capital =
        validateNonNegativeNumber(
          Number(account.capital),
          "capital",
        );

      if (
        newTotalInvestedCost >
        capital
      ) {
        throw new Error(
          `Portfolio cost RM${newTotalInvestedCost.toFixed(
            2,
          )} exceeds capital RM${capital.toFixed(
            2,
          )}`,
        );
      }

      const marketValue =
        roundMoney(
          quantity *
            currentPrice,
        );

      const profitLoss =
        roundMoney(
          quantity *
            (currentPrice -
              avgPrice),
        );

      await tx.holding.upsert({
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
        tx,
        {
          syncCashBalance: true,
        },
      );

      const savedHolding =
        await tx.holding.findUnique({
          where: {
            userId_symbol: {
              userId,
              symbol,
            },
          },
        });

      if (!savedHolding) {
        throw new Error(
          "Holding could not be saved",
        );
      }

      return savedHolding;
    },
  );
}

export async function deleteCustomerHolding(
  userId: string,
  symbol: string,
) {
  const normalizedSymbol =
    normaliseSymbol(symbol);

  if (!normalizedSymbol) {
    throw new Error(
      "Symbol is required",
    );
  }

  return prisma.$transaction(
    async (tx) => {
      const holding =
        await tx.holding.findUnique({
          where: {
            userId_symbol: {
              userId,
              symbol:
                normalizedSymbol,
            },
          },
        });

      if (!holding) {
        throw new Error(
          "Holding not found",
        );
      }

      await tx.holding.delete({
        where: {
          userId_symbol: {
            userId,
            symbol:
              normalizedSymbol,
          },
        },
      });

      await recalculateAccount(
        userId,
        tx,
        {
          syncCashBalance: true,
        },
      );

      return true;
    },
  );
}
