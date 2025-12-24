import app from "./src/app.js";
import { config } from "./src/config/config.js";
import connectDB from "./src/config/db.js";

const startServer = () => {
  const port = config.port || 5513;

  connectDB();

  app.listen(port, () => {
    console.log(`Listening on port ${port} → http://localhost:${port}`);
  });
};

startServer();
