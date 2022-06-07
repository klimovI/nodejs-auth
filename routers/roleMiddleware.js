const jwt = require('jsonwebtoken');

module.exports = function (roles) {
  return function (req, res, next) {
    if (req.method === 'OPTIONS') {
      next();
    }

    try {
      const token = req.headers.authorization.split(' ')[1];

      if (!token) {
        return res.status(400).send('User unauthorized');
      }

      const { roles: userRoles } = jwt.verify(token, 'secret');

      const hasRole = userRoles.some(role => roles.includes(role));

      if (!hasRole) {
        return res.status(400).send('Cannot access');
      }

      next();
    } catch (error) {
      console.log(error);
      return res.status(400).send('User unauthorized');
    }
  };
};
