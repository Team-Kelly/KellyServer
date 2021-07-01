const jwt = require("jsonwebtoken");

module.exports = {
    checkAccessToken: (req, res, next) => {
        let token = req.get("authorization");
        if (token) {
            token = token.slice(7);
            jwt.verify(token, ""+process.env.JWT_Secret_Key, (err, decoded) => {
                if (err) {
                    return res.sendStatus(403); //invalid token
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            return res.sendStatus(400); //Access Denied, worng access token or not sended
        }
    },
    checkRefreshToken: (req, res, next) => {
        let token = req.body.refreshtoken;
        if (token) {
            jwt.verify(token, ""+process.env.JWT_Refresh_Key, (err, decoded) => {
                if (err) {
                    return res.sendStatus(403); //invalid token
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            return res.sendStatus(401); //Access Denied, worng refresh token or not sended
        }
    }
};