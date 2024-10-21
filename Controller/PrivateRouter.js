const express = require("express");
const router = express.Router();
const userRouter = require('./PrivateContoller/UserRouter')
router.use(userRouter)

router.get('',(req,res)=>{
    console.log(req)
    res.send("asdf")
});

module.exports = router;