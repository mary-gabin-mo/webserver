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

    console.log(foundUser.user_ID); // devel
    // check password match
    // const { email, password } = foundUser;
    const match = await bcrypt.compare(pwd, foundUser.password);

    // if match:
    if (match) {
      // create accessToken
      const accessToken = jwt.sign(
        {
          UserInfo: {
            // id: foundUser.user_ID,
            email: foundUser.email,
            role: foundUser.user_type,
          },
        }, // do not include pwd here
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1m" }
      );
      // create refreshToken
      const refreshToken = jwt.sign(
        {
          UserInfo: {
            id: foundUser.user_ID,
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
        role: foundUser.user_type,
        accessToken,
      });
    } else {
      res.sendStatus(401);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }

  // const foundUser = usersDB.users.find((person) => person.username === user);
  // if (!foundUser) return res.sendStatus(401); // Unauthorized
  // // evaluate password
  // const match = await bcrypt.compare(pwd, foundUser.password);
  // if (match) {
  //   const roles = Object.values(foundUser.roles);
  //   // create JWT
  //   // ACCESS TOKEN
  //   const accessToken = jwt.sign(
  //     {
  //       UserInfo: {
  //         username: foundUser.username,
  //         roles: roles,
  //       },
  //     }, // do not include pwd here
  //     process.env.ACCESS_TOKEN_SECRET,
  //     { expiresIn: "5m" }
  //   );
  //   // REFRESH TOKEN
  //   const refreshToken = jwt.sign(
  //     { username: foundUser.username }, // do not include pwd herer
  //     process.env.REFRESH_TOKEN_SECRET,
  //     { expiresIn: "1d" } // refresh token expires much later than the access token
  //   );
  //   // saving refresh token with current user

  //   // return refreshToken in cookie

  //   // return accessToken in json
  //   const otherUsers = usersDB.users.filter(
  //     (person) => person.username != foundUser.username
  //   );
  //   const currentUser = { ...foundUser, refreshToken };
  //   usersDB.setUsers([...otherUsers, currentUser]);
  //   await fsPromises.writeFile(
  //     path.join(__dirname, "..", "model", "users.json"),
  //     JSON.stringify(usersDB.users)
  //   );

  //   // cookie always sent with every request, but is httpOnly - so not available to JS --> much more secure than another cookie that is available to JS
  //   res.cookie("jwt", refreshToken, {
  //     httpOnly: true,
  //     sameSite: "None",
  //     secure: true,
  //     maxAge: 24 * 60 * 60 * 1000,
  //   }); // time in milliseconds; equal to one day
  //   res.json({ accessToken }); // good practice to store access token in memory; NOT in local storage
  // } else {
  //   res.sendStatus(401);
  // }
};

module.exports = { handleLogin };
