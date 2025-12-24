import express from "express";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./middlewares/globalErrorHandler.js";
import routes from "./routes/index.routes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({
    message: `this is server root route ➡️ Request handled by PORT: ${process.env.PORT}`,
  });
});

app.use("/api", routes);

app.use(globalErrorHandler);

export default app;
