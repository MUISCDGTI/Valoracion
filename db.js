const mongoose = require("mongoose");
const DB_URL = process.env.MONGO_URL || "mongodb://localhost:27017";

const dbConnect = function () {
  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error: "));
  return mongoose.connect(DB_URL, { useNewUrlParser: true });
};

module.exports = dbConnect;
