const express = require('express');
const { Review, Listing } = require('../models/models');
//const Listing = require('../models/listings');
const router = express.Router();
const multer = require('multer');

// storage parameters
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

// for security reasons
// only accept jpeg and png images
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
const upload = multer({storage: storage, fileFilter: fileFilter, limits: {
    fileSize: 1024 * 1024 * 1024 * 20 // 20 megabyte image size limit
}});


router.get('/', (req, res) => {
    res.send('Welcome to Movya API v1');
});

router.post('/createreview', async (req, res) => {
    const review = new Review({
        user: req.body.user,
        title: req.body.title,
        body: req.body.body
    });

    //console.log(review);

    await review.save(function (err) {
        if (err) {
            console.log(err);
            return;
        }

        res.json(review);
    });
});


router.post('/createlisting', upload.array('photos', 2), async (req, res) => {
    console.log(req.files);
    const listing = new Listing({
        host: req.body.host,
        title: req.body.title,
        description: req.body.description,
        location: req.body.location,
        rules: req.body.rules,
        numOccupants: req.body.numOccupants,
        concierge: req.body.concierge,
        self_drive: req.body.self_drive,
        host_photo: req.files[0].path,
        car_photo: req.files[1].path,
        date_available: req.body.date_available
    });

    console.log(listing);
    await listing.save(function (err) {
        if (err) {
            console.log(err);
            return;
        }
    });

    res.json(listing);
});

router.post('/testpic', upload.array('photos', 2), async(req, res) => {
    console.log(req.files[0].path);
});

module.exports = router;