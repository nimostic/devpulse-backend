import type { NextFunction, Request, Response } from "express";
import type { ROLES } from "../types";
import { StatusCodes } from "http-status-codes";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";

export const auth = (...roles: ROLES[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: "Unauthorized access!!",
        });
      }

      let decoded: JwtPayload;

      try {
        decoded = jwt.verify(
          token,
          config.jwt_secret as string
        ) as JwtPayload;
      } catch {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: "Invalid or expired token",
        });
      }

      const userData = await pool.query(
        `SELECT * FROM users WHERE id = $1`,
        [decoded.id]
      );

      if (userData.rows.length === 0) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: "User not found",
        });
      }

      const user = userData.rows[0];

      if (roles.length && !roles.includes(user.role)) {
        return res.status(StatusCodes.FORBIDDEN).json({
          success: false,
          message: "Forbidden: no access",
        });
      }

      req.user = decoded;
      next();
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Something went wrong",
      });
    }
  };
};
