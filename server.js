const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const path = require("path");
const bodyParser = require("body-parser");
require("dotenv").config();
const connectDB = require("./db/db");
connectDB();

// serving static files
app.use(express.static("public"));

// set the view engine to ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

// Configurations for "body-parser"
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.json());


app.use("/", require("./routes/index"));
app.use("/api", require("./routes/files"));
app.use("/files", require("./routes/download"));
app.listen(PORT, () => {
  console.log(`Server running on port : ${PORT}`);
});
