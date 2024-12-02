// third party middleware
// cors: Cross Origin Resource Sharing
const allowedOrigins = require("./allowedOrigins");
const corsOptions = {
  origin: (origin, callback) => {
    // if (allowedOrigins.indexOf(origin) != -1) { // production
    if (allowedOrigins.indexOf(origin) != -1 || !origin) {
      // development
      // if the domain is in the allowedOrigins
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
