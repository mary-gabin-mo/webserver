const User = require("../model/users");

exports.getAllUsers = async (req, res, next) => {
  try {
    const [allUsers] = await User.fetchAll();
    res.status(200).json(allUsers);
  } catch (err) {
    console.log(err);
  }
};
