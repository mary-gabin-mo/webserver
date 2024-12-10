const express = require("express");
const router = express.Router();
const profileController = require("../../controllers/profileController");
const verifyRoles = require("../../middleware/verifyRoles");

router
  .route("/")
  .post(verifyRoles("STUDENT"), profileController.createNewProfile)
  .get(verifyRoles("STUDENT"), profileController.getProfiles);

module.exports = router;
