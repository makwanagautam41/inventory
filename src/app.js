import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.json({
    message: `this is server root route ➡️ Request handled by PORT: ${process.env.PORT}`,
  });
});

export default app;
