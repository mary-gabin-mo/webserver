const User = require("../model/Users");
const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt)
    return res
      .status(401)
      .json({ message: "no cookies found - refreshTokenController" }); // if cookies do not exist
  console.log(cookies.jwt); // devel
  const refreshToken = cookies.jwt;

  try {
    // const [[foundUser]] = await User.find(email);
    // if (!foundUser) return res.sendStatus(403); // Forbidden

    if (!refreshToken)
      return res
        .status(401)
        .json({ message: "refreshToken does not exist in cookie" });

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err)
          return res
            .status(403)
            .json({ message: "refreshTokenController erro" });
        // const roles = Object.values(foundUser.roles);
        const user_ID = decoded.UserInfo.user_ID;
        const email = decoded.UserInfo.email;
        const role = decoded.UserInfo.role;
        const accessToken = jwt.sign(
          {
            UserInfo: {
              user_ID,
              email,
              role,
            },
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "10s" }
        );
        res.json({ user_ID, email, role, accessToken });
      }
    );
  } catch (err) {
    console.log(err);
  }
};

module.exports = { handleRefreshToken };
