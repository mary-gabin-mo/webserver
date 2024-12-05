const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const fsPromises = require("fs").promises; // remove once db is connected
const path = require("path"); // remove once db is connected

const handleLogin = async (req, res) => {
  const { email, pwd } = req.body;
  if (!email || !pwd)
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  const foundUser = usersDB.users.find((person) => person.username === user);
  if (!foundUser) return res.sendStatus(401); // Unauthorized
  // evaluate password
  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    const roles = Object.values(foundUser.roles);
    // create JWT
    // ACCESS TOKEN
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          roles: roles,
        },
      }, // do not include pwd herer
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "5m" }
    );
    // REFRESH TOKEN
    const refreshToken = jwt.sign(
      { username: foundUser.username }, // do not include pwd herer
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" } // refresh token expires much later than the access token
    );
    // saving refresh toekn with current user
    const otherUsers = usersDB.users.filter(
      (person) => person.username != foundUser.username
    );
    const currentUser = { ...foundUser, refreshToken };
    usersDB.setUsers([...otherUsers, currentUser]);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "model", "users.json"),
      JSON.stringify(usersDB.users)
    );

    // cookie always sent with every request, but is httpOnly - so not available to JS --> much more secure than another cookie that is available to JS
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    }); // time in milliseconds; equal to one day
    res.json({ accessToken }); // good practice to store access token in memory; NOT in local storage
  } else {
    res.sendStatus(401);
  }
};

module.exports = { handleLogin };
