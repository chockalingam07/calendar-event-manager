const { validationResult } = require("express-validator");
const calendarService = require("../services/calendarService");

exports.checkConflicts = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ status: false, errors: errors.array() });
  }
  const { start, end, participants } = req.body;
  const result = await calendarService.checkConflicts(start, end, participants);
  res.json(result);
};

exports.suggestTimes = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ status: false, errors: errors.array() });
  }
  const { start, end, participants } = req.body;
  const result = await calendarService.suggestTimes(start, end, participants);
  res.json(result);
};

exports.createEvent = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ status: false, errors: errors.array() });
  }
  const { start, end, participants } = req.body;
  try {
    const event = await calendarService.createEvent(start, end, participants);
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
