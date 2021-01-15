const express = require('express');
const router = express.Router();

//@route        POST api/profile
//@desc         Test route
//@access       Public
router.post('/', (req, res) => {
    console.log(req.body);
    res.send("profile route");
});

module.exports = router;