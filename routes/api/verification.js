const express = require("express");
const router = express.Router();
const verificationController = require("../../controllers/verificationController");
const verifyRoles = require("../../middleware/verifyRoles");

router
  .route("/")
  .get(verifyRoles("ADMIN"), verificationController.getUnverifiedRequests)
  .put(verifyRoles("ADMIN"), verificationController.updateVerificationStatus);

module.exports = router;
