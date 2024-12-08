const express = require("express");
const router = express.Router();
const profileController = require("../../controllers/profileController");
const verifyRoles = require("../../middleware/verifyRoles");

router
  .route("/")
  .post(verifyRoles("STUDENT"), profileController.createNewProfile);
// .get(verifyRoles("ADMIN"), verificationController.getUnverifiedRequests);
// .get(verificationController.getUnverifiedRequests); // devel

// router.route('/:id')
// .get(verifyRoles("ADMIN"), verificationController.getRequest);

module.exports = router;
