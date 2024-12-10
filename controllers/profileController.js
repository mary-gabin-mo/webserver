const Profile = require("../model/Profile");

const createNewProfile = async (req, res) => {
  const {
    // // profile_ID,
    // user_ID,
    // description,
    // rentRange,
    // cleanliness,
    // roomCapacity,
    // location,
    // noiseTolerance,
    // socialHabits,
    // sleepSchedule,
    formData,
  } = req.body;

  console.log("formData: ", formData);
  console.log("req.user_ID: ", req.user_ID);

  if (!req.user_ID || !formData.description) {
    return res.status(400).json({ message: "user_ID or description missing." });
  }

  try {
    // insert into the table
    await Profile.add(
      //   profile_ID,
      req.user_ID,
      formData.description,
      formData.rentRange,
      formData.cleanliness,
      formData.roomCapacity,
      formData.location,
      formData.noiseTolerance,
      formData.socialHabits,
      formData.sleepSchedule
    );
    res.status(201).json({ success: "Profile successfully created." });
  } catch (err) {
    console.log("profileController: ", err);
    res.status(500).json({ message: err.message });
  }
};

const getProfiles = async (req, res) => {
  try {
    const [profiles] = await Profile.fetchAll();
    if (!profiles)
      return res
        .status(204)
        .json({ message: "No profiles found - profileController" });
    console.log(profiles);
    res.json(profiles);
  } catch (err) {
    console.log(err);
  }
};

module.exports = { createNewProfile, getProfiles };
