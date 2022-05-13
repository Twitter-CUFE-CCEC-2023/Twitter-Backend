const cors = async (req, res, next) => {
  req.set("Access-Control-Allow-Origin", "*");
  next();
};

module.exports = cors;