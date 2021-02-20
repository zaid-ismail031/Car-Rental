mongoose = require('mongoose');

const BookingSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    listing_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    listing_host: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    serviceType: {
        type: Boolean,
        required: true
    } // if true, then booking is for self-drive. if false, then booking is for concierge
},
{
    timestamps: {
        createdAt: 'created_at'
    }
},
{
    collection: 'bookings'
});

module.exports = mongoose.model('Booking', BookingSchema);