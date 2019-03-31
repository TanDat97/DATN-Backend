const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, 'shhhhh');
        req.userData = decoded;    
        if(req.body.userid === req.userData.id) {
            next();
        } else {
            throw {
                message: 'invalid token and userid'
            }
        } 
    } catch (error) {
        return res.status(401).json({
            status: 401,
            message: 'token failed',
            error: error,
        });
    }
};
