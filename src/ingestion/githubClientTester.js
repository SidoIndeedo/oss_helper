const { ingestIssuse } = require("./ingestIssues");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

async function run() {
  const data = await ingestIssuse();

  console.log("Sample issue:");
  console.log(data.issues[0]);

  console.log("Sample repository:");
  console.log(data.repositories[0]);
}

run();
