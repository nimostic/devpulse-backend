import { pool } from "../../db";
import type { issue } from "./issue.interface";

const createIssueIntoDB = async (payload: issue, reporter_id: string) => {
  // console.log("payload", payload);
  const { title, description, type } = payload;
  const result = await pool.query(
    `
        INSERT INTO issues (title,description,type,reporter_id) values ($1,$2,$3,$4) returning *
        `,
    [title, description, type, reporter_id],
  );
  return result;
};

const getIssuesFromDB = async (query: {
  type?: string;
  status?: string;
  sort?: string;
}) => {
  const conditions: string[] = [];
  const values: string[] = [];

  // filters
  if (query.type) {
    values.push(query.type);
    conditions.push(`type = $${values.length}`);
  }

  if (query.status) {
    values.push(query.status);
    conditions.push(`status = $${values.length}`);
  }

  const whereClause = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";

  const orderBy = query.sort === "oldest" ? "ASC" : "DESC";

  // STEP 1: fetch issues
  const issuesResult = await pool.query(
    `
    SELECT * FROM issues
    ${whereClause}
    ORDER BY created_at ${orderBy}
    `,
    values,
  );

  const issues = issuesResult.rows;

  // STEP 2: extract reporter ids
  const reporterIds = [...new Set(issues.map((i) => i.reporter_id))];

  if (reporterIds.length === 0) {
    return issuesResult;
  }

  // STEP 3: fetch users in batch
  const userResult = await pool.query(
    `
    SELECT id, name, role FROM users
    WHERE id = ANY($1)
    `,
    [reporterIds],
  );

  const users = userResult.rows;

  // STEP 4: create map
  const userMap = new Map();
  users.forEach((u) => userMap.set(u.id, u));

  // STEP 5: merge data
  const finalData = issues.map((issue) => {
    const { reporter_id, ...rest } = issue;

    return {
      ...rest,
      reporter: userMap.get(issue.reporter_id) || null,
    };
  });
  return finalData;
};

const getSingleIssueFromDB = async (id: string) => {
  const issueResult = await pool.query(`SELECT * FROM issues WHERE id = $1`, [
    id,
  ]);

  if (issueResult.rows.length === 0) {
    return null;
  }

  const issue = issueResult.rows[0];

  const userResult = await pool.query(
    `SELECT id, name, role FROM users WHERE id = $1`,
    [issue.reporter_id],
  );
  const { reporter_id, ...rest } = issue;
  return {
    ...rest,
    reporter: userResult.rows[0] || null,
  };
};

const updateIssueFromDB = async (
  body: {
    title: string;
    description: string;
    type: string;
  },
  id: string,
) => {
  const result = await pool.query(
    `
    UPDATE issues 
      SET title = $1,
          description = $2,
          type = $3,
          updated_at = NOW()
    WHERE id = $4 
    RETURNING *
    `,
    [body.title, body.description, body.type, id],
  );

  return result;
};

const deleteIssueFromDB = async (id: string) => {
  const result = await pool.query(
    `
      DELETE FROM issues WHERE id = $1
      RETURNING *
      `,
    [id],
  );
  if (result.rows.length === 0){
    return null
  }
  return result;
};

export const issueService = {
  createIssueIntoDB,
  getIssuesFromDB,
  getSingleIssueFromDB,
  updateIssueFromDB,
  deleteIssueFromDB,
};
