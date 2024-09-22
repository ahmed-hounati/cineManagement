const jwt = require('jsonwebtoken');
const tokenBlacklist = require('../token/tokenBlacklist');


function verifyToken(req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1];
    

    if (!token || tokenBlacklist.has(token)) {
        return res.status(401).json({ message: 'Access denied, no token provided' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = verified;
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token' });
    }
}

module.exports = verifyToken;
