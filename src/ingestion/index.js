const { ingestIssuse } = require("./ingestIssues");
const path = require("path");
const dotenv = require("dotenv");
const { connectDB } = require("../config/db");

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

async function runIngestion() {
  try {

    await connectDB();
    console.log("Connected to database...");
    await ingestIssuse();
    console.log("Ingestion completed successfully.");
  } catch (error) {
    console.error("Error during ingestion:", error);
  } finally {
    process.exit(0);
  }
}

if (require.main === module) {
  runIngestion();
}

module.exports = { runIngestion, ingestIssuse };