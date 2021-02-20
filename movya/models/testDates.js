const mongoose = require('mongoose');

const testSchema = mongoose.Schema({
    dates: {
        type: [Date],
        required: true
    }
}, {
    collection: 'testDates'
});

module.exports = mongoose.model('Test', testSchema);