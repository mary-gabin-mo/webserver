const db = require("../config/dbConn");

module.exports = class User {
  constructor() {}

  static fetchAll() {
    return db.execute("SELECT * FROM User");
  }

  ///// check for duplicate usernames in the db /////
  static duplicate(email) {
    return db.execute("SELECT email FROM User WHERE email = ?", [email]);
  }

  static async add(name, email, hashedPwd, user_type, yos, major) {
    // Store new user
    await db.execute(
      "INSERT INTO User (name, email, password, user_type) VALUES (?, ?, ?, ?)",
      [name, email, hashedPwd, user_type || "STUDENT"]
    );

    const [row] = await db.execute("SELECT LAST_INSERT_ID()");
    const student_id = row[0]["LAST_INSERT_ID()"];
    // console.log(student_id);

    // Insert Status
    var datetime = new Date();
    const datetime_str = datetime.toISOString().slice(0, 10);
    const desc = "desc..."; // can't remember what we were gonna store in description of the status...
    const context = "Verification";
    const status_name = "Pending";
    await db.execute(
      "INSERT INTO Status(status_context, status_name, description, created_date, last_updated) VALUES (?, ?, ?, ?, ?)",
      [context, status_name, desc, datetime_str, datetime_str]
    );

    const [row2] = await db.execute("SELECT LAST_INSERT_ID()");
    const status_id = row2[0]["LAST_INSERT_ID()"];
    // console.log(status_id);

    // console.log(yos, major);

    // Create Verification request
    await db.execute(
      "INSERT INTO Verification (student_ID, verified_date, year_of_study, major, status_ID, admin_ID) VALUES (?, ?, ?, ?, ?, ?)",
      [student_id, null, yos, major, status_id, null]
    );
    return;
  }
};
