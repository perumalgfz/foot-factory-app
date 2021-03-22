const jwt = require('jsonwebtoken');

module.exports = {
    checkToken: (req, res, next) => {
        let token = req.headers['authorization'];
        token = token.split(' ')[1]; //AccessToken

        if (token) {

            jwt.verify(token, "wo+~PPEy&Kdc[Zw", (err, user) => {
                // console.log('Token Err:' +err)    
                if (!err) {

                    req.user = user;
                    next();
                } else {
                    return res.status(403).json({
                        message: "User is not authenticated"
                    });
                }

            });
        } else {
            // there is not token.
            return res.json({
                success: 0,
                message: "Access denied! unauthorised user."
            });
        }

    }
}