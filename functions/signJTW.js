import jwt from 'jsonwebtoken';
import config from '../config/config.js';

const NAMESPACE = 'Auth';
const signJWT = (user, callback) => {
    var timeSinceEpoch = new Date().getTime();
    var expirationTime = timeSinceEpoch + Number(config.server.token.expireTime) * 100000;
    var expirationTimeInSeconds = Math.floor(expirationTime / 1000);


    try {
        jwt.sign(
            {
                phone: user.phone,
                role: user.role,
                id: user._id
            },
            config.server.token.secret,
            {
                issuer: config.server.token.issuer,
                algorithm: 'HS256',
                expiresIn: expirationTimeInSeconds
            },
            (error, token) => {
                if (error) {
                    callback(error, null);
                } else if (token) {
                    callback(null, token);
                }
            }
        );
    } catch (error) {
        callback(error, null);
    }
};

export default signJWT;
