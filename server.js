const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const path = require("path");
const bodyParser = require("body-parser");
require("dotenv").config();
const connectDB = require("./db/db");
connectDB();


//  Deleting past 24 data form db and from uploads file
const File = require("./models/file");
const fs = require("fs");

async function deleteData() {
  const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const files = await File.find({ createdAt : { $lt : pastDate}});
  // console.log(files);
  if (files.length) {
    for (const file of files) {
      try {
        fs.unlinkSync(file.path);
        await file.deleteOne({uuid : file.uuid});
        console.log(`Successfully deleted ${file.filename}`);
      } catch (error) {
        console.log(`Error while deleting file ${file.filename}`);
      }
    }
    console.log(`Job done!`);
  }
}

// For production uncomment this
// setInterval(deleteData, 24 * 60 * 60);
deleteData().catch(console.dir);

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
