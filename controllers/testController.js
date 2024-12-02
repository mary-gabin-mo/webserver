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

const login = async (req, res) => {};
module.exports = { getAllUsers, register, login };
