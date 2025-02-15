const jwt = require("jsonwebtoken");

exports.generateTokens = (id) => {
  const learnupAccessToken = jwt.sign({ id }, process.env.JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
  const learnupRefreshToken = jwt.sign({ id }, process.env.JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: "180d",
  });
  return { learnupAccessToken, learnupRefreshToken };
};
