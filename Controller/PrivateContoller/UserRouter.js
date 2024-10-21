const express = require("express");
const router = express.Router();

const { getUser } = require('../../Repository/User');

router.get('/userinfo', (req, res) => {
    getUser(req.uuid)
    .then((result) => {
        switch (result) {
            case 401:
                return res.status(401).send();
            case 500:
                return res.status(500).send();
            default:
                return res.json(result);  // .send()는 불필요
        }
    })
    .catch((error) => {
        // 예외 처리
        console.error(error);
        res.status(500).send("An error occurred while fetching user info.");
    });
});

module.exports = router;
