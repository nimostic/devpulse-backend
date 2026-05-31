import bcrypt from "bcrypt";
import { pool } from "../../db";
import jwt from "jsonwebtoken";
import config from "../../config";
import type { User } from "./auth.interface";

const createUserIntoDB = async (payload: User) => {
  const { name, email, password, role } = payload;
  const hashPassword = await bcrypt.hash(password as string, 10);

  const result = await pool.query(
    `
        INSERT INTO users(name,email,password,role) values($1,$2,$3,COALESCE($4,'contributor')) RETURNING *
        `,
    [name, email, hashPassword, role],
  );
  delete result.rows[0].password;
  return result;
};

const loginUserIntoDB = async (payload: {
  email: string;
  password: string;
}) => {
  const { email, password } = payload;
  //1.check user exists
  //2.compare pass
  //3.generate token

  //1
  const userData = await pool.query(
    `
        SELECT * FROM users WHERE email = $1
        `,
    [email],
  );
  if (userData.rows.length === 0) {
    throw new Error("Invalid Credentials!!!");
  }

  //2
  const user = userData.rows[0];
  const matchPassword = await bcrypt.compare(password, user.password);
  if (!matchPassword) {
    throw new Error("Invalid Credentials!!!");
  }

  //3
  const jwtpayload = {
    id: user.id,
    name: user.name,
    role: user.role,
  };
  const token = jwt.sign(jwtpayload, config.jwt_secret as string, {
    expiresIn: "1d",
  });

  //   const refreshToken = jwt.sign(jwtpayload, config.jwt_secret as string, {
  //     expiresIn: "1d",
  //   });
  delete user.password;
  return { token, user };
};

export const userService = {
  createUserIntoDB,
  loginUserIntoDB,
};
