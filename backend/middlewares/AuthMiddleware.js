const jwt = require("jsonwebtoken");

const AuthMiddleware = (req, res, next) => {
    const jwtValue = req.headers["authorization"];
    jwt.verify(jwtValue, process.env.JWT_SECRET_KEY, (err, userInfo) => {
        if(err){
            res.sendStatus(403);
            return;
        }

        console.log(userInfo);
        req.userInfo = userInfo;
        next();
    })
}

module.exports = AuthMiddleware;