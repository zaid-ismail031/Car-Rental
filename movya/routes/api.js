const express = require('express');
const Listing = require('../models/listings');
const Review = require('../models/reviews');
const User = require('../models/users');
const Booking = require('../models/bookings');
const verify = require('./verifyToken');
const router = express.Router();
const multer = require('multer');
const Test = require('../models/testDates');
const fs = require('fs');
const { array } = require('joi');
//const { findOne } = require('../models/users');

// storage parameters
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, String(Number(Date.now())).concat(file.originalname));
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
router.post('/createlisting', upload.array('photos', 2), verify, async (req, res) => {
    //console.log(req.files);
    //console.log(req.body.title);
    //console.log(req.body.description);
    //console.log(req.body.location);
    console.log(req.files);
    const user = await User.findOne({_id: req.user});
    try {
        const listing = new Listing({
            host_id: user._id,
            host: user.name,
            title: req.body.title,
            vehicleType: req.body.vehicleType,
            description: req.body.description,
            location: req.body.location,
            rules: req.body.rules,
            numOccupants: req.body.numOccupants,
            concierge: req.body.concierge,
            self_drive: req.body.self_drive,
            host_photo: req.files[0].filename,
            car_photo: req.files[1].filename,
            dates_available: req.body.dates_available
        });
        await listing.save(function (err) {
            if (err) {
                const path1 = './uploads/'.concat(req.files[0].filename);
                const path2 = './uploads/'.concat(req.files[1].filename);
                
                fs.unlink(path1, function (err) {
                    if (err) {
                        console.log(err);
                    }
                })

                fs.unlink(path2, function (err) {
                    if (err) {
                        console.log(err);
                    }
                })
                
                console.log("Error occured here at await listing.save");
                return res.status(400).json({error: "Please fill in all fields appropriately"});
            }
            else {
                return res.status(200).json({success: "Listing created"});
            }
        });

    } catch (err) {
        console.log("Error occured here at catch");
        return res.status(400).json({error: "Please fill in all fields appropriately"});  
    }
    
    //upload.array('photos', 2) 
    console.log("Random shit");
    
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

    const listingHostId = String(listing.host_id);
    const userId = String(user._id);

    console.log(req.files[0].filename);

    if (listingHostId != userId) return status(400).send("Not allowed");

    update = {
        title: req.body.title,
        vehicleType: req.body.vehicleType,
        description: req.body.description,
        location: req.body.location,
        rules: req.body.rules,
        numOccupants: req.body.numOccupants,
        concierge: req.body.concierge,
        self_drive: req.body.self_drive,
        host_photo: req.files[0].filename,
        car_photo: req.files[1].filename,
        dates_available: req.body.dates_available
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

// For testing purposes
router.post('/test', async(req, res) => {
    var dates = req.body.dates[0].concat("T00:00:00.000Z");
    const date2 = String(dates);
    const date3 = 'Fri Feb 19 2021 02:00:00 GMT+0200 (South Africa Standard Time)';
    const unixTime = String(Date.parse(dates));
    console.log("This is the ms", unixTime); 
    //if (unixTime == "NaN") return res.status(400).send("Date is not formatted correctly");
    //const datesArray = Array(req.body.dates);
    //console.log(datesArray);
    //console.log(dates);
    test = new Test({
        dates: req.body.dates
    });

    const datesArray1 = test.dates;
    const datesArray2 = [String(Date.parse(datesArray1[0])), String(Date.parse(datesArray1[1]))];

    console.log("This is the array1", datesArray1.length);
    console.log("This is the datesArray2", datesArray2);
    console.log("This is the string", dates);
    console.log("This is date2", date2);
    if (datesArray2.includes(unixTime)) return res.json({"message": "It does include"});
    if (test.dates.includes("random")) return res.json({"message": "It does not include"});

    await test.save(function (err) {
        if (err) console.log(err);
    })
    res.send(test);
});

// Booking API (creates booking)
router.post('/bookings/:listing_id', verify, async(req, res) => {
    const user = await User.findOne({_id: req.user});
    const listing = await Listing.findOne({_id: req.params.listing_id});

    console.log(user);
    // Security checks
    const user_id = String(user._id); // ID of user making the booking
    const host_id = String(listing.host_id); // ID of the hostuser of the listing that is being booked

    // Ensure that users cannot book themselves
    if (user_id == host_id) return res.status(400).send("You cannot book your own listing");

    // Ensure that users chosen service matches the hosts offering (i.e. either self drive or concierge, or both)
    const selfdrive = String(listing.self_drive);
    const concierge = String(listing.concierge);
    const chosenService = String(req.body.serviceType);

    if (chosenService != selfdrive) return res.status(400).send("Host does not allow self-drive bookings");
    if (chosenService == concierge) return res.status(400).send("Host does not allow concierge bookings");

    // Check if booking date matches the host's offered dates
    var bookingDate = req.body.date.concat("T00:00:00.000Z");
    const unixTimeBooking = String(Date.parse(bookingDate));
    var offeredDates = listing.dates_available;
    if (unixTimeBooking == "NaN") return res.status(400).send("Date is not formatted correctly");

    // Check if chosen date is at least 24 hours away
    const currentDateUnixTime = Date.now();  
    const oneDayInSeconds = 86400;
    if (Number(unixTimeBooking) - currentDateUnixTime < oneDayInSeconds) return res.status(400).send("Chosen booking date must be made at least 24 hours prior");

    offeredDatesArray = [];
    for (var i = 0; i < offeredDates.length; i++) {
        offeredDatesArray.push(String(Date.parse(offeredDates[i])));
    }

    if (offeredDatesArray.includes(unixTimeBooking) == false) return res.status(400).send("Host does not offer the selected date");

    booking = new Booking({
        "user_id": user._id,
        "listing_id": req.params.listing_id,
        "listing_host": listing.host,
        "date": req.body.date,
        "serviceType": req.body.serviceType
    });

    await booking.save(function (err) {
        if (err) console.log(err);
    })
    res.send(booking);
});

module.exports = router;