const User = require("../model/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getAllUsers = async (req, res) => {
  try {
    const [allUsers] = await User.fetchAll();
    res.status(200).json(allUsers);
  } catch (err) {
    console.log(err);
  }
};

const register = async (req, res) => {
  const { name, email, password, user_type, yos, major } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required!" });
  }
  try {
    // check for duplicate email
    const [[duplicate]] = await User.duplicate(email);
    if (duplicate)
      return res.status(409).json({ message: "Email already exists!" }); // Conflict
    // hash the password
    const hashedPwd = await bcrypt.hash(password, 10);
    // store the new user
    await User.add(name, email, hashedPwd, user_type, yos, major);
    console.log("Success");
    res.status(201).json({ success: `New user ${name} created.` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  try {
    const [[foundUser]] = await User.find(email);
    // console.log(foundUser);
    // console.log(foundUser["password"]);
    if (!foundUser) return res.sendStatus(401); // Unauthorized
    // evaluate password
    const match = await bcrypt.compare(password, foundUser["password"]);
    if (match) {
      //   console.log("Match");
      // ACCESS TOKEN
      const accessToken = jwt.sign(
        {
          user_ID: foundUser["user_ID"],
          user_type: foundUser["user_type"],
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "5m" }
      );
      // REFRESH TOKEN
      const refreshToken = jwt.sign(
        { user_ID: foundUser["user_ID"] },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" } // lasts much longer than accees token
      );

      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });
      res.json({ accessToken });
    } else {
      res.sendStatus(401);
    }
    // return;
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAllUsers, register, login };
