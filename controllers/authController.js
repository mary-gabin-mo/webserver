const User = require("../model/Users");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
// const fsPromises = require("fs").promises; // remove once db is connected
// const path = require("path"); // remove once db is connected

const handleLogin = async (req, res) => {
  const { email, pwd } = req.body; // values coming from FE
  if (!email || !pwd)
    return res
      .status(400)
      .json({ message: "Email and password are required." });

  try {
    // find the email from db
    const [[foundUser]] = await User.find(email);
    // if !foundUser, throw User Not Found error
    if (!foundUser) return res.status(400).json({ message: "Email Not Found" });

    console.log(`authController: ${foundUser.user_ID}`); // devel
    // check password match
    // const { email, password } = foundUser;
    const match = await bcrypt.compare(pwd, foundUser.password);

    // if match:
    if (match) {
      // create accessToken
      const accessToken = jwt.sign(
        {
          UserInfo: {
            user_ID: foundUser.user_ID,
            email: foundUser.email,
            role: foundUser.user_type,
          },
        }, // do not include pwd here
        process.env.ACCESS_TOKEN_SECRET,
        // { expiresIn: "10s" }
        { expiresIn: "10m" } // devel
      );
      // create refreshToken
      const refreshToken = jwt.sign(
        {
          UserInfo: {
            user_ID: foundUser.user_ID,
            email: foundUser.email,
            role: foundUser.user_type,
          },
        }, // do not include pwd herer
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" } // refresh token expires much later than the access token
      );

      // send back the accessToken and refreshToken
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      }); // time in milliseconds; equal to one day
      res.json({
        user_ID: foundUser.user_ID,
        email: foundUser.email,
        role: foundUser.user_type,
        accessToken,
      });
    } else {
      console.log(`authController error`);
      res.sendStatus(401);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};
module.exports = { handleLogin };
