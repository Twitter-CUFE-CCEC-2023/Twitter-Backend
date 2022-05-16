const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, "CCEC-23-Twitter-Clone-CUFE-CHS");
    const user = await User.findOne({
      _id: decoded._id,
      tokens: { $elemMatch: { "tokens.token": token } },
      isVerified: true,
    });

    if (!user) {
      throw new Error();
    }
    const tokenExpirationDate = user.tokens.filter((x) => x.token === token)[0]
      .token_expiration_date;

    if (tokenExpirationDate < Date.now()) {
      user.tokens = user.tokens.filter((x) => x.token !== token);
      await User.updateOne({ _id: user._id }, { $set: { tokens: user.tokens } });
      throw new Error();
    }
    res.set("Access-Control-Allow-Origin", "*");
    req.user = user;
    req.token = token;
    next();
  } catch (e) {
    res.status(401).send({ message: "User is not authenticated or invalid token" });
  }
};

module.exports = auth;
