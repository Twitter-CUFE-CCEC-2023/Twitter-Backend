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
    //get all expired tokens
    const expiredTokens = user.tokens.filter(
      (token) => token.token_expiration_date <= Date.now()
    );

    //Remove expired tokens
    expiredTokens.forEach((token) => {
      user.tokens = user.tokens.filter((t) => t.token !== token.token);
    });
    user = await User.updateOne(
      { _id: user._id },
      { $set: { tokens: user.tokens } }
    ,{ new: true });

    //check if token is present in user tokens
    const tokenExists = user.tokens.find(
      (token) => token.token === token
    );
    if(!tokenExists){
      throw new Error();
    }
    res.set("Access-Control-Allow-Origin", "*");
    req.user = user;
    req.token = token;
    next();
  } catch (e) {
    res
      .status(401)
      .send({ message: "User is not authenticated or invalid token" });
  }
};

module.exports = auth;
