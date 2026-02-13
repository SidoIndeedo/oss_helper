const { ingestIssuse } = require("./ingestIssues");
const path = require("path");
const dotenv = require("dotenv");
const { connectDB } = require("../config/db");

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

async function run() {
  await connectDB();
  await ingestIssuse();
  process.exit(0);
}

run();
