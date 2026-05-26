import dotenv from "dotenv";
import path from "path";
dotenv.config({
  path: path.join(process.cwd(), ".env"),
});
const config = {
  PORT: process.env.PORT,
  connectionString: process.env.connectionString as string,
  jwt_secret : "devpulse_secure_jwt_secret_2026_9f3a7c1d8b2e4f6ahjkfhsdkhjhjiuhie45453c"
};

export default config;
