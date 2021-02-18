const mongoose = require('mongoose');

const ListingSchema = mongoose.Schema({
    host: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
        min: 5,
        max: 70
    },
    description: {
        type: String,
        required: true,
        min: 10,
        max: 2000
    },
    location: String,
    rules: {
        type: String,
        required: true,
        min: 10,
        max: 2000
    },
    numOccupants: {
        type: Number,
        required: true
    },
    concierge: {
        type: Boolean,
        required: true
    },
    self_drive: {
        type: Boolean,
        required: true
    },
    host_photo: {
        type: String,
        required: true
    },
    car_photo: {
        type: String,
        required: true
    },
    date_available: {
        type: Array,
        required: true,
        default: [Date]
    }
}, {
    collection: 'listings'
    }
);

const ReviewSchema = mongoose.Schema({
    listingId: {
        type: String,
        required: true,
        max: 1000
    },
    userId: {
        type: String,
        required: true,
        max: 1000
    },
    name: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    title: {
        type: String,
        min: 1,
        max: 1000
    },
    body: {
        type: String,
        min: 1,
        max: 10000
    },
},
    {
        timestamps: {
            createdAt: 'created_at'
        }
    },
    {
        collection: 'reviews'
    }
);

module.exports = mongoose.model('Review', ReviewSchema);
