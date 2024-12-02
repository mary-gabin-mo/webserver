const express = require("express");
const router = express.Router();
const path = require("path");

router.get("^/$|index(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "index.html"));
});

// any get request that comes in that looks for '/', it does ... (whatever's in the anonym function)
router.get("^/$|index(.html)?", (req, res) => {
  //   res.send("Hello World!");
  //   res.sendFile("./views/index.html", { root: __dirname });
  res.sendFile(path.join(__dirname, "..", "views", "index.html"));
});

router.get("/new-page(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "new-page.html"));
});

router.get("/old-page(.html)?", (req, res) => {
  res.redirect(301, "/new-page.html"); // default status code = 302
  // we need 301 to tell the search engine that the page has moved permanently
});

module.exports = router;
