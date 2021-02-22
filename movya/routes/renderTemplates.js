const router = require('express').Router();
const jwt = require('jsonwebtoken');
const verify = require('./verifyToken');
const Listing = require('../models/listings');

// @Public
router.get('/', (req, res) => {
    //const token = req.header('auth-token');
    const token =  req.cookies['auth-token'];

    if (!token) {
        return res.render('home', {user: false});
    }

    try{
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        return res.render('home', {user: true});
        
    }
    catch (err) {
        return res.render('home', {user: false});
    }
});

// @Private
router.get('/login', verify, (req, res) => {
    res.render('login', {user: true});
});

// @Private
router.get('/register', verify, (req, res) => {
    res.render('register', {user: true});
});


router.get('/create', verify, (req, res) => {
    res.render('create', {user: true});
});

router.get('mylistings', verify, (req, res) => {
    const mylistings = Listing.find({host_id: req.user})
    res.render('mylistings', {user: true, mylistings:mylistings})
})

module.exports = router;