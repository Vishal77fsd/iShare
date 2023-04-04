const mongoose = require("mongoose");

function connectDB() {
  mongoose.connect(process.env.DB);
  const connection = mongoose.connection;

  connection.once("open", () => {
    console.log("Connected to db successfully");
  });
}

module.exports = connectDB;
