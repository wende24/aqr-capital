import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma";

export async function adminLogin(
  req: Request,
  res: Response,
) {
  try {
    const { email, password } = req.body ?? {};

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email.trim().toLowerCase(),
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        password: true,
        role: true,
      },
    });

    if (!user || user.role !== "ADMIN") {
      return res.status(401).json({
        success: false,
        message: "Admin access denied",
      });
    }

    const validPassword = await bcrypt.compare(
      password,
      user.password,
    );

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials",
      });
    }

    const secret =
      process.env.JWT_SECRET || "aqr-capital-local-secret";

    const token = jwt.sign(
      {
        userId: user.id,
        role: "ADMIN",
      },
      secret,
      {
        expiresIn: "12h",
      },
    );

    return res.json({
      success: true,
      message: "Admin login successful",
      data: {
        token,
        admin: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}