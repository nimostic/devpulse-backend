import type { Request, Response } from "express";
import { userService } from "./auth.service";
import { StatusCodes } from "http-status-codes";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.createUserIntoDB(req.body);
    // console.log(result)
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "User Created successfully!",
      data: result.rows[0],
    });
  } catch (error: any) {
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
        errors: "Duplicate email is not allowed",
      });
    }
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: error.message,
      errors: error,
    });
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.loginUserIntoDB(req.body);
    // console.log(result);

    res.status(StatusCodes.ACCEPTED).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error: any) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};

export const userController = {
  createUser,
  loginUser,
};
