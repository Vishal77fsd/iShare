const router = require("express").Router();
const File = require("../models/file");

router.get("/:uuid", async (req, res) => {
  try {
    const file = await File.findOne({ uuid: req.params.uuid });

    return res.render("download", {
      uuid: req.params.uuid,
      fileName: file.filename,
      fileSize: file.size,
      downloadLink: `${process.env.APP_BASE_URL}/files/download/${file.uuid}`,
    });
  } catch (error) {
    return res.render("download", { error: "Something went wrong" });
  }
});

router.get("/download/:uuid", async (req, res) => {
  const file = await File.findOne({ uuid: req.params.uuid });
  if (!file) {
    return res.render("download", { error: "Link has been expired" });
  } else {
    const filePath = `${__dirname}/../${file.path}`;

    return res.download(filePath);
  }
});

router.post("/send/:uuid", async (req, res) => {
  // console.log(req.params.uuid);

  const emailTo = req.body.email;
  const sendEmail = require("../services/email");

  const file = await File.findOne({ uuid: req.params.uuid });


  if (!file) {
    return res.render("download", { error: "Link has been expired" });
  }
  // console.log(file.filename);
  // console.log(file.path);
  // console.log(file.size);
  sendEmail({
    from: "vishal7738639800@gmail.com",
    to: emailTo,
    subject: "inShare file sharing",
    text: `${file.filename}`,
    html: require("../services/emailTemplate")({
      emailFrom: "vishal7738639800@gmail.com",
      downloadLink: `${process.env.APP_BASE_URL}/files/download/${file.uuid}`,
      size: parseInt(file.size / 1000) + "KB",
      expires: "24 hours",
    }),
  });

  return res.redirect("back");
});

module.exports = router;
