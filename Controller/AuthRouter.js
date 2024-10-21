const express = require("express");
const router = express.Router();
const {signup,login} = require('../Repository/Auth');
const {jwtProvider} = require('../MiddleWare/JWTtoken');
router.post("/signup", async(req, res) => {
    const {id,pw,nickname} = req.body;
    if(id || pw || nickname){
        const code = await signup(id,pw,nickname);
        return res.status(code).send();
    }
    return res.status(400).send();
});
router.post("/login", async (req,res)=>{
    const {id,pw} = req.body;
    if(id||pw){
        const {id,pw} = req.body;
        const code = await login(id,pw);
        switch (code) {
            case 401:
                return res.status(401).send();
            case 500:
                return res.status(500).send();
            default:
                const token = jwtProvider(code.member_uuid)
                return res.status(200).json({"token":token,"nickname":code.member_nickname,"money":code.member_money}).send();
        }
    }
    return res.status(400).send();
});
module.exports = router;