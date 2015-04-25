var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var eventSchema = mongoose.Schema({
    title: String, //required
    category: String,
    dateAdded: {type: Date, default: Date.now},
    comments: String,
    dateStart: {type: Date, default: Date.now},
    dateEnd: Date,
    scheduledReminders: [Date],
    missedReminders: {type: [Date],default: []}
});


// create user model, expose to app
module.exports = {
	model: mongoose.model('Event', eventSchema),
	schema: eventSchema
};