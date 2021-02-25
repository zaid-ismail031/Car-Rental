const mongoose = require('mongoose');

const ListingSchema = mongoose.Schema({
    host_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
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
    vehicleType: {
        type: String,
        enum: ['Sedan', 'SUV', 'Station Wagon', 'Coupe', 'Convertible', 'Hatchback', 'Sports Car', 'Super Car', 'Vintage', 'Minivan', 'Bus', 'Truck', 'Van'],
        required: true
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
        required: false
    },
    car_photo: {
        type: String,
        required: false
    },
    dates_available: {
        type: [Date],
        required: true
    }
},
{
    timestamps: {
        createdAt: 'created_at'
    }
}, 
{
    collection: 'listings'
})

module.exports = mongoose.model('Listing', ListingSchema);