import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export type AuthenticatedRequest = Request & {
  userId?: string;
};

export function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({
      success: false,
      message: "Authorization token is required.",
    });
  }

  const [scheme, token] = authorization.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({
      success: false,
      message: "Invalid authorization header.",
    });
  }

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    return res.status(500).json({
      success: false,
      message: "JWT secret is not configured.",
    });
  }

  try {
    const payload = jwt.verify(
      token,
      jwtSecret,
    ) as {
      userId?: string;
    };

    if (!payload.userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid token.",
      });
    }

    req.userId = payload.userId;

    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
}
