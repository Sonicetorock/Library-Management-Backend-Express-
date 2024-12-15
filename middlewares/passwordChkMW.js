const bcrypt = require('bcrypt');


/*
    @params: req, res, next
    @desc: Compare password with hashed password
    @access: Public
    @returns: Calls next() if password is valid, else returns an error response
*/
const comparePassword = async (req, res, next) => {
  const { password, hashedPassword } = req.body;

  if (!password || !hashedPassword) {
    return res.status(400).json({ error: 'Password and hashedPassword are required' });
  }

  try {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    next(); // valid password
  } catch (error) {
    return res.status(500).json({ error: 'Error comparing passwords' });
  }
};

module.exports = comparePassword;
