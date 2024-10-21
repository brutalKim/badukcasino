const {jwtVerify} = require('./JWTtoken');
//요청의 권한 판단
async function AuthFilter (req,res,next){
    const authHeader = req.headers.authorization;
    try{
        const authentication = await jwtVerify(authHeader);
        req.uuid = authentication.uuid;
        next();
    }catch(err){
        switch (err.name) {
            case 'TokenExpiredError':
                return res.status(419)
                .json({
                    err:'TokenExpiredError'
                });
            case 'JsonWebTokenError':
                return res.status(401)
                .json({
                    err:'JsonWebTokenError'
                });
        }
    }
}
module.exports = AuthFilter;