const db = require("../config/dbConn");

module.exports = class User {
  constructor() {}

  static fetchAll() {
    return db.execute("SELECT * FROM User");
  }
};
