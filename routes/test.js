const express = require("express");
const router = express.Router();
const testController = require("../controllers/testController");

router.route("/").get(testController.getAllUsers).post(testController.login);

module.exports = router;
