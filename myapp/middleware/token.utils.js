var jwt= require("jsonwebtoken") 
var createToken = function(auth) {
    return jwt.sign({
            id: auth.id
        }, 'shhhhh',
        {
            expiresIn: 60 * 120
        });
};

module.exports = {
  generateToken: function(req, res, next) {
      req.token = createToken(req.auth);
      return next();
  },
  sendToken: function(req, res) {
      res.setHeader('authorization', req.token);
      return res.status(200).send(JSON.stringify(req.user));
  }
};