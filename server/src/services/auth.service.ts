import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { prisma } from "../config/prisma";

type RegisterInput = {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
};

type LoginInput = {
  email: string;
  password: string;
};

export async function registerUser(input: RegisterInput) {
  const email = input.email.trim().toLowerCase();

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new Error("EMAIL_ALREADY_EXISTS");
  }

  const passwordHash = await bcrypt.hash(input.password, 12);

  const user = await prisma.user.create({
    data: {
      fullName: input.fullName.trim(),
      email,
      phone: input.phone?.trim() || null,
      password: passwordHash,
      account: {
        create: {
          accountType: "cash",
          cashBalance: 0,
          totalValue: 0,
        },
      },
    },
    include: {
      account: true,
    },
  });

  return user;
}

export async function loginUser(input: LoginInput) {
  const email = input.email.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    include: {
      account: true,
    },
  });

  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const passwordMatches = await bcrypt.compare(
    input.password,
    user.password,
  );

  if (!passwordMatches) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET_NOT_CONFIGURED");
  }

  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
    },
    jwtSecret,
    {
      expiresIn: "7d",
    },
  );

  return {
    token,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      createdAt: user.createdAt,
    },
    account: user.account,
  };
}
