import express from "express";
import { globalErrorHandler } from "./middlewares/globalErroHandler";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: `this is server root route ➡️ Request handled by PORT: ${process.env.PORT}`,
  });
});

app.use("/api", routes);

app.use(globalErrorHandler);

export default app;
