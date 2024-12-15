const jwt = require('jsonwebtoken');

// create JWT Token
// takes payload: data to be stored in the token
// returns the generated token
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15d' });
};

// validate JWT Token
// takes token: token to be validated
// returns the decoded token if valid
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

module.exports = { generateToken, verifyToken };
