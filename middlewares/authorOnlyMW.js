const allowAuthorOnly = (req, res, next) => {
    if (req.user.role !== 'Author') {
        return res.status(403).json({ error: 'Access denied. Only authors are allowed.' });
    }
    next();
};

module.exports = allowAuthorOnly;