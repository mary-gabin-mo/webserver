const Verification = require("../model/Verification");

const getUnverifiedRequests = async (req, res) => {
  try {
    // retrieve all unverified requests
    const [unverifiedRequests] = await Verification.fetchAllUnverified();
    if (!unverifiedRequests)
      return res.status(204).json({
        message: "Unverified Requests Not Found - verificationController",
      });
    // console.log(unverifiedRequests); // devel
    // console.log("Admin_ID: ", req.user_ID); // devel

    res.json(unverifiedRequests);
  } catch (error) {
    console.log(error);
  }
};
//test

const updateVerificationStatus = async (req, res) => {
  const { student_ID, status_name } = req.body;
  console.log(`student_ID: ${student_ID}, status_name: ${status_name}`); // devel
  // const admin_ID = req.user_ID;
  const admin_ID = req.user_ID; // devel
  // console.log("Admin_ID: ", req.user_ID); // devel

  try {
    // update verification
    const updated = await Verification.updateVerification(
      admin_ID,
      student_ID,
      status_name
    );

    if (updated) res.status(200).json({ message: "Update Successful" });
    else res.status(500).json({ message: "Update not successful" });
  } catch (err) {
    console.log("Error from verification controller - cannot update status");
    console.log(err);
    res.sendStatus(500);
  }
};

module.exports = { getUnverifiedRequests, updateVerificationStatus };
