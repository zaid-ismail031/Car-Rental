const express = require('express');
const Listing = require('../models/listings');
const Review = require('../models/models');
const User = require('../models/users');
const verify = require('./verifyToken');
const router = express.Router();
const multer = require('multer');
const { findOne } = require('../models/users');

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

// API home page
router.get('/', (req, res) => {
    res.send('Welcome to Movya API v1');
});

// API for creating reviews
router.post('/createreview', verify, async (req, res) => {
    const user = await User.findOne({_id: req.user});
    console.log("THIS IS THE USER", user);
    const review = new Review({
        user_id: user._id,
        listing_id: req.body.listing_id, // links review to particular listing
        name: user.name,
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


// API for creating listings
router.post('/createlisting', verify, upload.array('photos', 2), async (req, res) => {
    console.log(req.files);
    const user = await User.findOne({_id: req.user});
    const listing = new Listing({
        host_id: user._id,
        host: user.name,
        title: req.body.title,
        description: req.body.description,
        location: req.body.location,
        rules: req.body.rules,
        numOccupants: req.body.numOccupants,
        concierge: req.body.concierge,
        self_drive: req.body.self_drive,
        host_photo: req.files[0].path,
        car_photo: req.files[1].path
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


// Edit review
router.post('/editreview/:review_id', verify, async(req, res) => {
    const user = await User.findOne({_id: req.user});
    const review = await Review.findOne({_id: req.params.review_id});
    // Validate
    console.log("compare 1", review.user_id);
    console.log("compare 2", user._id);

    const reviewUserId = String(review.user_id);
    const UserId = String(user._id);
    if (reviewUserId != UserId) return res.status(400).send('Not allowed'); // Prevent users from editing other people's Id's
    const update = {
        title: req.body.title,
        body: req.body.body
    }

    let editedReview = await Review.findOneAndUpdate({_id: req.params.review_id}, update, {
        new: true
    })

    await editedReview.save(function (err) {
        console.log(err);
        return;
    });

    res.json(editedReview);

});

// Edit listing
router.post('/editlisting/:listing_id', verify, async(req, res) => {
    const user = await User.findOne({_id: req.user});
    const listing = await Listing.findOne({_id: req.params.listing_id});

    const listingHostId = string(listing.host_id);
    const userId = string(user._id);

    if (listingHostId != userId) return status(400).send("Not allowed");

    update = {
        title: req.body.title,
        description: req.body.description,
        location: req.body.location,
        rules: req.body.rules,
        numOccupants: req.body.numOccupants,
        concierge: req.body.concierge,
        self_drive: req.body.self_drive,
        host_photo: req.files[0].path,
        car_photo: req.files[1].path
    }

    let editedListing = await Listing.findOneAndUpdate({_id: req.params.listing_id}, update, {
        new: true
    })

    await editedListing.save(function(err) {
        console.log(err);
        return
    })

    res.json(editedListing);

});


// Get particular listing by listing_id
router.get('/listings/:listing_id', verify, async(req, res) => {
    console.log("this is it", req.params.listing_id);
    const data = await Listing.findById(req.params.listing_id);
    console.log("listing data", data);
    res.send(data);
});

// Get reviews associated with listing_id
router.get('/reviews/:listing_id', verify, async(req, res) => {
    const data = await Review.find({listing_id: req.params.listing_id});
    res.send(data);
});


module.exports = router;