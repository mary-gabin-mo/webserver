const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.roles) return res.sendStatus(401); // Unauthorized
    const rolesArray = [...allowedRoles];
    // console.log(rolesArray);
    // console.log(req.roles);
    const result = req.roles
      .map((role) => rolesArray.includes(role))
      .find((val) => val === true); // compare each role in req.roles to the roles in rolesArray, and from the true/false array, fine the first true
    if (!result) return res.sendStatus(401);
    next();
  };
};

module.exports = verifyRoles;
