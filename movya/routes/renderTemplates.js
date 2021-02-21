const router = require('express').Router();
const jwt = require('jsonwebtoken');

router.get('/', (req, res) => {
    const token = req.header('auth-token');
    console.log(req.header('Cookie'));
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

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/register', (req, res) => {
    res.render('register');
});

module.exports = router;