import { Request, Response } from "express";
import { z } from "zod";

import {
  loginUser,
  registerUser,
} from "../services/auth.service";

const registerSchema = z.object({
  fullName: z.string().min(2, "Full name is required."),
  email: z.string().email("Invalid email address."),
  phone: z.string().optional(),
  password: z.string().min(8, "Password must be at least 8 characters."),
  terms: z.boolean().optional(),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string().min(1, "Password is required."),
});

export async function register(
  req: Request,
  res: Response,
) {
  const parsed = registerSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid registration data.",
      errors: parsed.error.flatten(),
    });
  }

  if (parsed.data.terms !== true) {
    return res.status(400).json({
      success: false,
      message: "You must accept the terms.",
    });
  }

  try {
    const user = await registerUser({
      fullName: parsed.data.fullName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      password: parsed.data.password,
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful.",
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
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "EMAIL_ALREADY_EXISTS"
    ) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered.",
      });
    }

    console.error("Registration error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}

export async function login(
  req: Request,
  res: Response,
) {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid login data.",
      errors: parsed.error.flatten(),
    });
  }

  try {
    const result = await loginUser({
      email: parsed.data.email,
      password: parsed.data.password,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      data: result,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "INVALID_CREDENTIALS"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (
      error instanceof Error &&
      error.message === "JWT_SECRET_NOT_CONFIGURED"
    ) {
      return res.status(500).json({
        success: false,
        message: "JWT secret is not configured.",
      });
    }

    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}
