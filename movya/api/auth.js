const User = require('../models/users');
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('../validation');

// REGISTER
router.post('/register', async (req, res) => {

    console.log(req.body);

    // Validate for any unwanted data
    const { error } = registerValidation(req.body);
    console.log("This is the error: ", error);
    if (error) {
        return res.status(400).send(error);
    }

    // Check if user already in database
    const emailExist = await User.findOne({email : req.body.email});
    if(emailExist) return res.status(400).send('Email already exists');

    // Hash password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    console.log(hashedPassword);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    })

    //console.log(user);

    await user.save(function (err) {
        if (err) {
            console.log(err);
            return;
        }

        res.json({user: user._id});
    })
});



// LOG IN
router.post('/login', async (req, res) => {
    const {error} = loginValidation(req.body);
    if (error) {
        return res.status(400).send(error);
    }

    // Validate email
    const user = await User.findOne({email : req.body.email});
    if(!user) return res.status(400).send('Email or password is incorrect');

    // Validate password
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send('Email or password is incorrect');

    // Create token and assign
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);
    res.json({"Message": "Logged in"});
})

module.exports = router;