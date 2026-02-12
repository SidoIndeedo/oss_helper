const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.resolve(__dirname, "../.env") });
// const PORT = 3232;
const APIrouter = require("./API/routes");

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api", APIrouter);

app.listen(process.env.PORT, () => {
  console.log("we are back");
});
