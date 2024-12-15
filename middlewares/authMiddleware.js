const { verifyToken } = require('../utils/jwtUtils');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; //Bearer token

    // If token is not provided
  if (!token) {
    return res.status(401).json({ error: 'Access denied, no token provided' });
  }

  try {
    // If token is provided, verify it and get the decoded user details
    const decoded = verifyToken(token);
    req.user = decoded; 
    next();
  } catch (error) { // If token is invalid or expired
    return res.status(401).json({ error: 'Not Allowed !! Invalid or expired token' });
  }
};

module.exports = authMiddleware;
