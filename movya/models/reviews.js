const mongoose = require('mongoose');

const ReviewSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    listing_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
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
