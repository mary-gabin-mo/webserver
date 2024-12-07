const express = require("express");
const router = express.Router();
const verificationController = require("../controllers/verificationController");
const verifyRoles = require("../middleware/verifyRoles");

router
  .route("/")
  .get(verifyRoles("ADMIN"), verificationController.getUnverifiedRequests);
// .get(verificationController.getUnverifiedRequests); // devel
// .post(verifyRoles("ADMIN"), verificationController.verifyRequests);

// router.route('/:id')
// .get(verifyRoles("ADMIN"), verificationController.getRequest);

module.exports = router;
