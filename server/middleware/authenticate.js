const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {

  let decoded = null;
  const secret = 'secret123';

  try {
    const token = req.header('x-auth');
    if(!token) {
      throw new Error('Authentication failed');
    }

    decoded = jwt.verify(token, secret);
    req.user = {id: decoded.id, email: decoded.email};
    req.token = token;
    next();

  } catch(e) {
    return res.status(401).json({
      error: e.message
    });
  }

};

module.exports = { authenticate };
