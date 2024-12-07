const Verification = require("../model/Verification");
const jwt = require("jsonwebtoken");

const getUnverifiedRequests = async (req, res) => {
  try {
    // retrieve all unverified requests
    const [unverifiedRequests] = await Verification.fetchAllUnverified();
    if (!unverifiedRequests)
      return res.status(204).json({
        message: "Unverified Requests Not Found - verificationController",
      });
    console.log(unverifiedRequests); // devel
    res.json(unverifiedRequests);
  } catch (error) {
    console.log(error);
  }
};

// const verifyRequests = async (req, res) => {};

// const handleVerification = async (req, res) => {
//   return <div></div>;
// };

module.exports = { getUnverifiedRequests };
