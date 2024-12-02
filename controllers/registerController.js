const User = require("../model/users");
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
  const { name, email, password, user_type } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required!" });
  }
  try {
    // check for duplicate email
    const [[duplicate]] = await User.duplicate(email);
    console.log(duplicate);
    if (duplicate)
      return res.status(409).json({ message: "Email already exists!" }); // Conflict
    // hash the password
    const hashedPwd = await bcrypt.hash(password, 10);
    // store the new user
    User.add(name, email, hashedPwd, user_type);
    console.log("Success");
    res.status(201).json({ success: `New user ${name} created.` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };