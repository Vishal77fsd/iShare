const File = require("./models/file");
const fs = require("fs");
const connectDB = require("./db/db");

connectDB();

async function fetchData() {
  // const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const files = await File.find({ createdAt : { $lt : new Date(Date.now() - 24 * 60 * 60 * 1000)}});
  console.log(files.length);
  if (files.length) {
    for (const file of files) {
      try {
        fs.unlinkSync(file.path);
        await file.remove();
        console.log(`Successfully deleted ${file.filename}`);
      } catch (error) {
        console.log(`Error while deleting file ${file.filename}`);
      }
    }
    console.log(`Job done!`);
  }
}

fetchData();
