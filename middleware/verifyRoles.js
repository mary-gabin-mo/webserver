const verifyRoles = (allowedRole) => {
  return (req, res, next) => {
    if (!req?.role) return res.sendStatus(401); // Unauthorized
    const result = req.roles === allowedRole;
    // .map((role) => rolesArray.includes(role))
    // .find((val) => val === true); // compare each role in req.roles to the roles in rolesArray, and from the true/false array, fine the first true
    if (!result) return res.sendStatus(401);
    next();
  };
};

module.exports = verifyRoles;
