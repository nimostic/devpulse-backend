import type { Request, Response } from "express";
import { issueService } from "./issue.service";
import { StatusCodes } from "http-status-codes";

const createIssue = async (req: Request, res: Response) => {
  try {
    const result = await issueService.createIssueIntoDB(req.body, req.user?.id);
    // console.log(result.rows)
    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Issue created successfully",
      data: result.rows,
    });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Validation error",
      errors: "Description must be at least 20 characters",
    });
  }
};

const getIssues = async (req: Request, res: Response) => {
  try {
    const query = req.query;

    const result = await issueService.getIssuesFromDB(query);
    // console.log(result);
    if (result.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Issue not found!",
        data: [],
      });
    }
    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Issue Retrieved successfully",
      data: result,
    });
  } catch (error) {
   return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: "something went wrong!", error: error });
  }
};

const getSingleIssue = async (req: Request, res: Response) => {
  try {
    const result = await issueService.getSingleIssueFromDB(
      req.params.id as string,
    );
    if (!result) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Issue not found",
      });
    }
    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Issue Retrieved successfully",
      data: result,
    });
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: "something went wrong!", error: error });
  }
};

const updateIssue = async (req: Request, res: Response) => {
  try {
    const result = await issueService.updateIssueFromDB(
      req.body,
      req.params.id as string,
    );
    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Issue updated successfully",
      data: result.rows[0],
    });
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: "Something went wrong!", error: error });
  }
};

const deleteIssue = async (req: Request, res: Response) => {
  try {
    const result = await issueService.deleteIssueFromDB(
      req.params.id as string,
    );
    if (!result) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Issue not found",
      });
    }
    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Issue deleted successfully",
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Issue deletion failed",
      errors: error,
    });
  }
};

export const issueController = {
  createIssue,
  getIssues,
  getSingleIssue,
  updateIssue,
  deleteIssue,
};
