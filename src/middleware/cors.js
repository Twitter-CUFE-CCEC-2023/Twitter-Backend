const cors = async (req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");
  next();
};

module.exports = cors;