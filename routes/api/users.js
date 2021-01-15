const express = require('express');
const router = express.Router();

//@route        POST api/users
//@desc         Register user
//@access       Public
router.post('/', (req, res) => {
    console.log("request body: ", req.body);
    res.send("user post api");
});

module.exports = router;