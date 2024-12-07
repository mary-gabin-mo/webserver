const User = require("../model/Users");
const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401); // if cookies do not exist
  console.log(cookies.jwt); // devel
  const refreshToken = cookies.jwt;

  try {
    // const [[foundUser]] = await User.find(email);
    // if (!foundUser) return res.sendStatus(403); // Forbidden

    if (!refreshToken) return res.sendStatus(401);

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) return res.sendStatus(403);
        // const roles = Object.values(foundUser.roles);
        const accessToken = jwt.sign(
          {
            UserInfo: {
              id: decoded.UserInfo.id,
              email: decoded.UserInfo.email,
              role: decoded.UserInfo.user_type,
            },
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "15m" }
        );
        res.json({ accessToken });
      }
    );
  } catch (err) {
    console.log(err);
  }
};

module.exports = { handleRefreshToken };
