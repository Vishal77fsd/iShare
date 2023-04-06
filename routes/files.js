const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const File = require("../models/file");
const { v4: uuidv4 } = require("uuid");

// multer config
const storage = multer.diskStorage({
  // Where to store the file
  destination: (req, file, cb) => cb(null, "uploads/"),

  // filename uploaded by the user and what you should name that file
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    // 3003202346556 - 1000000000000.zip/jpg

    cb(null, uniqueName);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: (1 * 10000 * 10000) },
}).single("myfile");

router.post("/upload", (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.send(err);
    }
    // console.log(req.file);

    if (!req.file) {
      return res.redirect("/");
    }

    const file = new File({
      filename: req.file.filename,
      path: req.file.path,
      size: req.file.size,
      uuid: uuidv4(),
    });

    const response = await file.save();

    return res.redirect(`${process.env.APP_BASE_URL}/files/${response.uuid}`);
    // return res.json({
    //   file: `${process.env.DB}/files/${response.uuid}`,
    //   // http://localhost:3000/files/85ef9d9c-0126-4e53-bf28-34fdd3ac13f8
    // });
  });
  console.log("Image uploaded succesfully");
});

module.exports = router;
