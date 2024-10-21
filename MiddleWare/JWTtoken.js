const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET_KEY = process.env.JWT_SECRET_KEY;
const jwtProvider=(uuid)=>{
    const token = jwt.sign({
        type: 'JWT',
        uuid: uuid
    },SECRET_KEY,{
        expiresIn: '600m',
        issuer:'badukcasino'
    })
    return token;
}

const jwtVerify = (token) =>{
    decodedToken = jwt.verify(token,SECRET_KEY);
    return decodedToken;
}


module.exports = {
    jwtProvider,
    jwtVerify
};