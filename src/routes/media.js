const express = require("express");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");
const router = express.Router();
const { downloadMedia } = require("../services/s3");

router.get("/media/:id", async (req, res) => {
  const fileKey = req.params.id;
  const fileStream = await downloadMedia(fileKey);
  fileStream.pipe(res);
});

module.exports = router;