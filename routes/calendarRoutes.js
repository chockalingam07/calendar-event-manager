const express = require('express');
const router = express.Router();
const { validateCalendarInput } = require('../helpers/validation');
const {
  checkConflicts,
  suggestTimes,
  createEvent
} = require('../controllers/calendarController');

router.post('/check-conflicts', validateCalendarInput, checkConflicts);
router.post('/suggest-times', validateCalendarInput, suggestTimes);
router.post('/create-event', validateCalendarInput, createEvent);

module.exports = router;