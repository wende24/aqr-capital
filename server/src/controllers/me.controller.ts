import { Response } from "express";

import {
  AuthenticatedRequest,
} from "../middleware/auth.middleware";

import { prisma } from "../config/prisma";

export async function me(
  req: AuthenticatedRequest,
  res: Response,
) {
  if (!req.userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized.",
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      id: req.userId,
    },
    include: {
      account: true,
    },
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found.",
    });
  }

  return res.status(200).json({
    success: true,
    data: {
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        createdAt: user.createdAt,
      },
      account: user.account,
    },
  });
}
