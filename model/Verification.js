const db = require("../config/dbConn");

module.exports = class Verification {
  constructor() {}

  static async fetchAllUnverified() {
    return await db.execute(
      `SELECT * FROM Student JOIN Verification ON Student.user_ID = Verification.student_ID JOIN Status ON Verification.status_ID = Status.status_ID WHERE Status.status_name = 'Pending'`,
      []
    );
  }

  static async verify() {
    // update the status of the verification
    await db.execute(
      ```
      UPDATE Verification 
      SET admin_ID = ?
      WHERE student_ID = ?;
      ```,
      []
    );
  }
};
