import type { Request, Response } from "express";
import { issueService } from "./issue.service";
import { StatusCodes } from "http-status-codes";

const createIssue = async (req: Request, res: Response) => {
  try {
    const result = await issueService.createIssueIntoDB(req.body,req.user?.id);
    // console.log(result.rows)
    res
      .status(StatusCodes.CREATED)
      .json({ success: true, message: "Issue created successfully",data:result.rows });
  } catch (error) {
    
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, message:"something went wrong!",error:error });
  }
};

const getIssues = async (req: Request, res: Response) =>{
  try {
    const result = await issueService.getIssuesFromDB(req.body)
    res
      .status(StatusCodes.ACCEPTED)
      .json({ success: true, message: "Issue Retrieved successfully",data:result.rows });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ success: false, message:"something went wrong!",error:error });
  }
}


export const issueController = {
    createIssue,
    getIssues,
}