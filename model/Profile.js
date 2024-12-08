const db = require("../config/dbConn");

const profileQuery = `INSERT INTO Profile (user_ID, description) VALUES (?, ?)`;

const preferenceQuery = `INSERT INTO Preference (profile_ID, user_ID) VALUES (?, ?)`;

const rentQuery = "INSERT INTO RentRange (preference_ID, `range`) VALUES (?,?)";

const cleanQuery =
  "INSERT INTO Cleanliness (preference_ID, clean_level) VALUES (?,?)";

const roomQuery =
  "INSERT INTO RoomCapacity (preference_ID, room_amount) VALUES (?,?)";

const locationQuery =
  "INSERT INTO Location (preference_ID, quadrant) VALUES (?,?)";

const noiseQuery =
  "INSERT INTO NoiseTolerance (preference_ID, tolerance_level) VALUES (?,?)";

const socialQuery =
  "INSERT INTO SocialHabits (preference_ID, habits) VALUES (?,?)";

const sleepQuery =
  "INSERT INTO SleepSchedule (preference_ID, sleep_type) VALUES (?,?)";

module.exports = class Profile {
  constructor() {}

  static async add(
    // profile_ID,
    user_ID,
    description,
    rentRange,
    cleanliness,
    roomCapacity,
    location,
    noiseTolerance,
    socialHabits,
    sleepSchedule
  ) {
    try {
      await db.execute(profileQuery, [user_ID, description]);

      const [row] = await db.execute("SELECT LAST_INSERT_ID()");
      const profile_ID = row[0]["LAST_INSERT_ID()"];
      // console.log(profile_ID); // devel

      await db.execute(preferenceQuery, [profile_ID, user_ID]);

      const [row2] = await db.execute("SELECT LAST_INSERT_ID()");
      const preference_ID = row2[0]["LAST_INSERT_ID()"];
      // console.log(preference_ID); // devel

      //   console.log("rentRange type", typeof rentRange);
      const range = parseInt(rentRange, 10);
      //   console.log("new rentRange type", typeof rentRange);

      await db.execute(cleanQuery, [preference_ID, cleanliness]);
      await db.execute(roomQuery, [preference_ID, roomCapacity]);
      await db.execute(locationQuery, [preference_ID, location]);
      await db.execute(noiseQuery, [preference_ID, noiseTolerance]);
      await db.execute(socialQuery, [preference_ID, socialHabits]);
      await db.execute(sleepQuery, [preference_ID, sleepSchedule]);
      await db.execute(rentQuery, [preference_ID, rentRange]);
    } catch (error) {
      console.log(error);
    }
  }
  return;
};
