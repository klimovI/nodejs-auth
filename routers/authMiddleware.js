const jwt = require('jsonwebtoken');


module.exports = function (req, res, next) {
  if (req.method === 'OPTIONS') {
    next();
  }

  try {
    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
      return res.status(400).send('User unauthorized');
    }

    req.user = jwt.verify(token, 'secret');
    next();
  } catch (error) {
    console.log(error);
    return res.status(400).send('User unauthorized');
  }
};
