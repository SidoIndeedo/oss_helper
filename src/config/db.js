const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Monog DB connected");
  } catch (err) {
    console.log("DB connection failure");
    console.error(err);
    process.exit(1);
  }
}

module.exports = { connectDB };
