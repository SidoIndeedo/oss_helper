const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const { connectDB } = require("./config/db");

dotenv.config({ path: path.resolve(__dirname, "../.env") });
// const PORT = 3232;
const APIrouter = require("./API/routes");

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", APIrouter);

connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log("Server listening on port", process.env.PORT);
  });
});
