const User = require('../models/users');
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { registerValidation, loginValidation } = require('../validation');

router.post('/register', async (req, res) => {

    console.log(req.body);

    // Validate for any unwanted data
    const error = registerValidation(req.body);
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

        res.json(user);
    })
});

module.exports = router;