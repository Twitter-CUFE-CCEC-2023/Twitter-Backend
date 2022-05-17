require("dotenv").config();
const S3 = require("aws-sdk/clients/s3");
const fs = require("fs");

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secrentAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new S3({
  region,
  accessKeyId,
  secrentAccessKey,
});

const uploadMedia = function (file) {
  const fileStream = fs.createReadStream(file.path);
  const params = {
    Bucket: bucketName,
    Key: file.filename,
    Body: fileStream,
  };
  return s3.upload(params).promise();
};

const downloadMedia = function (fileKey) {
  const params = {
    Bucket: bucketName,
    Key: fileKey,
  };
  return s3.getObject(params).createReadStream();
};

exports.uploadMedia = uploadMedia;
exports.downloadMedia = downloadMedia;
