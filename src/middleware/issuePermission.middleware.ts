import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { pool } from "../db";

export const canUpdateIssue = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const issueId = req.params.id;
    const user = req.user;
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Unauthorized access!",
      });
    }

    //1. fetch issue

    const issueResult = await pool.query(
      `
        SELECT * FROM issues WHERE id = $1
        `,
      [issueId],
    );

    if (issueResult.rows.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Issue not found",
      });
    }

    const issue = issueResult.rows[0];
    //maintainer
    if (user.role === "maintainer") {
      return next();
    }

    //3. contributor roles
    if (user.role === "contributor") {
      if (issue.reporter_id !== user.id) {
        return res.status(StatusCodes.FORBIDDEN).json({
          success: false,
          message: "You can only update your own issues",
        });
      }
      if (issue.status !== "open") {
        return res.status(StatusCodes.FORBIDDEN).json({
          success: false,
          message: "You can only update open issues",
        });
      }
      return next();
    }
    return res.status(StatusCodes.FORBIDDEN).json({
      success: false,
      message: "Unauthorized access!",
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};
