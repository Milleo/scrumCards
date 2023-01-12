const jwt = require("jsonwebtoken");

const AuthMiddleware = (req, res, next) => {
    const jwtValue = req.cookies["jwt_token"];
    jwt.verify(jwtValue, process.env.JWT_SECRET_KEY, (err, userInfo) => {
        if(err){
            res.sendStatus(403);
            return;
        }

        req.userInfo = userInfo;
        next();
    })
}

module.exports = AuthMiddleware;