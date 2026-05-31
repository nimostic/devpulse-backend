import { pool } from "../../db";

const createIssueIntoDB = async (payload: any,reporter_id : any) => {
  console.log("payload",payload)
  const { title, description, type } = payload;
  const result = await pool.query(
    `
        INSERT INTO issues (title,description,type,reporter_id) values ($1,$2,$3,$4) returning *
        `,
    [title, description, type,reporter_id],
  );
  return result;
};


const getIssuesFromDB = async(payload:any)=>{
  const result = await pool.query(
    `
    SELECT * FROM issues
    `
  )
  return result
}


export const issueService = {
  createIssueIntoDB,
  getIssuesFromDB,
};
