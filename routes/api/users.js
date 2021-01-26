const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const {check, validationResult } = require('express-validator');

const User = require('../../models/User');

//@route        POST api/users
//@desc         Register user
//@access       Public
router.post('/', 
            [
                check('name', 'Name is required').not().isEmpty(),
                check('email', 'Please include a valid email').isEmail(),
                check('password', 'At least 6 characters').isLength({min: 6})
            ], 
            async (req, res) => {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({errors: errors.array()});
                }

                const { name, email, password } = req.body;

                try {
                    let user = await User.findOne({ email });
                    if (user) {
                        return res.status(400).json({errors: [{message: "The user already exists."}]});
                    }

                    avatar = gravatar.url(email, {
                        s: "200",
                        r: "pg",
                        d: "mm"
                    });
                    
                    user = new User({ email, name, password, avatar });
                    
                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(password, salt);
                    
                    await user.save();

                    const payload = { user: {id: user.id} };
                    jwt.sign(
                        payload,
                        config.get('jwtSecret'),
                        { expiresIn: 36000 },
                        (err, token) => {
                            if (err) throw err;
                            res.json({ token });
                        }
                    );

                    // res.send("user registered");
                } catch (err) {
                    console.error(err.message);
                    res.status(500).send("Server error!");
                }
});

module.exports = router;