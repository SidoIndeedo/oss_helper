const express = require("express");
const dotenv = require("dotenv");
const PORT = 3232;
const APIrouter = require("./API/routes");

dotenv.config({ path: "../.env" });
const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api", APIrouter);

app.listen(PORT, () => {
  console.log("we are back");
});
