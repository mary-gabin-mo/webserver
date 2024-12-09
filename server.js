require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const verifyJWT = require("./middleware/verifyJWT");
const credentials = require("./middleware/credentials");
const mysql = require("mysql2");
// const { createServer } = require("http");
// const { Server } = require("socket.io");

const PORT = process.env.PORT || 3500;

// custome middleware - custome logger
app.use(logger);

// Handle options credentials check - before CORS!
app.use(credentials);

app.use(cors(corsOptions)); // production
// app.use(cors()); // devel

// built-in middleware to handle relencoded data i.e. form data:
// 'content-type: application/x-www-form-urlencoded;
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json()); // app.use : applied to all routes that comes in

// middleware for cookies
app.use(cookieParser());

// serve static files
app.use(express.static(path.join(__dirname, "/public")));
app.use("/subdir", express.static(path.join(__dirname, "/public")));

// Routes
app.use("/", require("./routes/root"));
app.use("/subdir", require("./routes/subdir"));
app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
app.use("/test", require("./routes/test"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));

app.use(verifyJWT);
app.use("/verify", require("./routes/api/verification"));
// app.use("/employees", require("./routes/api/employees")); // example
app.use("/profile", require("./routes/api/profile"));

// app.use('/'); app.use more likely to be used by middleware; does not take regex
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

// error handling middleware
app.use(errorHandler);

// db.connect((err) => {
//   if (err) throw err;
//   console.log("Connected to the database!");
//   // listen at the end of the js file
// });
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
