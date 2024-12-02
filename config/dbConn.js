const mysql = require("mysql2");

// Connect to MySQL
const pool = mysql.createPool({
  connectionLimit: 5,
  host: process.env.MYSQL_ADDON_HOST,
  user: process.env.MYSQL_ADDON_USER,
  password: process.env.MYSQL_ADDON_PASSWORD,
  database: process.env.MYSQL_ADDON_DB,
  port: process.env.MYSQL_ADDON_PORT,
});

module.exports = pool.promise();
