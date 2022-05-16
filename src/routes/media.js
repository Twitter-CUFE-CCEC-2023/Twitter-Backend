const express = require("express");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");
const router = express.Router();
const { downloadMedia } = require("../services/s3");

router.get("/media/:id", auth, async (req, res) => {
  const fileKey = req.params.id;
  const fileStream = await downloadMedia(fileKey);
  res.setHeader("Content-Type", "image/jpeg");
  fileStream.pipe(res);
});

module.exports = router;