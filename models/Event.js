const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  start: {
    type: Date,
    required: true,
    index: true // index on start
  },
  end: {
    type: Date,
    required: true,
    index: true // index on end
  },
  participants: {
    type: [String],
    required: true,
    index: true // multi-key index for array search
  }
});


// EventSchema.index({ participants: 1, start: 1, end: 1 }); // Optional compound index

module.exports = mongoose.model('Event', EventSchema);
