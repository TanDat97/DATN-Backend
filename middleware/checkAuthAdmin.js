const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        // console.log(token);
        const decoded = jwt.verify(token, 'HS256');
        req.userData = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            status: 401,
            message: 'token failed'
        });
    }
};
