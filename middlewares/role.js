const jwt = require('jsonwebtoken');

function checkRole(requiredRole) {
    return (req, res, next) => {
        const token = req.header('Authorization')?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Access denied, no token provided' });
        }

        try {
            const verified = jwt.verify(token, process.env.JWT_SECRET);
            req.user = verified;
            console.log(req.user);
            

            if (req.user.role !== requiredRole) {
                return res.status(403).json({ message: `Access denied, you need to be an ${requiredRole}` });
            }

            next();
        } catch (error) {
            res.status(400).json({ message: 'Invalid token' });
        }
    };
}

module.exports = checkRole;
