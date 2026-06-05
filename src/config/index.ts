import dotenv from "dotenv";
import path from "path";
dotenv.config({
  path: path.join(process.cwd(), ".env"),
});
const config = {
  PORT: process.env.PORT,
  connectionString: process.env.connectionString as string,
  jwt_secret : process.env.jwt_secret as string
};

export default config;
