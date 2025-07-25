const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  start: Date,
  end: Date,
  participants: [String]
});

module.exports = mongoose.model('Event', EventSchema);