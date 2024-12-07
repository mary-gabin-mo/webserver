const verifyRoles = (allowedRole) => {
  return (req, res, next) => {
    console.log(req.data);
    if (!req?.role) {
      console.log("No role from request - from verifyRoles");
      return res.sendStatus(401); // Unauthorized
    }
    const result = req.role === allowedRole;
    // .map((role) => rolesArray.includes(role))
    // .find((val) => val === true); // compare each role in req.roles to the roles in rolesArray, and from the true/false array, fine the first true
    if (!result) {
      console.log("Unauthorized - from verifyRoles");
      return res.sendStatus(401);
    }
    next();
  };
};

module.exports = verifyRoles;
