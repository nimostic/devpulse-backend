import app from "./app";
import config from "./config";
import { initDB } from "./db";

const startServer = async () => {
  await initDB();
  
  app.listen(config.PORT, () => {
    console.log(`Server running on ${config.PORT}`);
  });
};

startServer();