const express = require("express");
const router = express.Router();
const verificationController = require("../../controllers/verificationController");
const verifyRoles = require("../../middleware/verifyRoles");

router
  .route("/")
  .get(verifyRoles("ADMIN"), verificationController.getUnverifiedRequests)
  .put(verifyRoles("ADMIN"), verificationController.updateVerificationStatus);
// .put(verificationController.updateVerificationStatus); // devel
// .get(verificationController.getUnverifiedRequests); // devel

// router.route('/:id')
// .get(verifyRoles("ADMIN"), verificationController.getRequest);

module.exports = router;
