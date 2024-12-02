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

  static add(name, email, hashedPwd, user_type) {
    db.execute(
      "INSERT INTO User (name, email, password, user_type) VALUES (?, ?, ?, ?)",
      [name, email, hashedPwd, user_type || "STUDENT"]
    );
  }
};
