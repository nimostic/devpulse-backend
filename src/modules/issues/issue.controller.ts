import type { Request, Response } from "express";
import { issueService } from "./issue.service";
import { StatusCodes } from "http-status-codes";

const createIssue = async (req: Request, res: Response) => {
  try {
    const result = await issueService.createIssueIntoDB(req.body, req.user?.id);
    // console.log(result.rows)
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Issue created successfully",
      data: result.rows,
    });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: "something went wrong!", error: error });
  }
};

const getIssues = async (req: Request, res: Response) => {
  try {
    const query = req.query;

    const result = await issueService.getIssuesFromDB(query);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Issue Retrieved successfully",
      data: result,
    });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: "something went wrong!", error: error });
  }
};

const getSingleIssue = async (req: Request, res: Response) => {
  try {
    const result = await issueService.getSingleIssueFromDB(
      req.params.id as string,
    );
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Issue Retrieved successfully",
      data: result,
    });
  } catch (error) {
    res
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
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Issue updated successfully",
      data: result.rows[0],
    });
  } catch (error) {
    res
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
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Issue deleted successfully",
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
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
