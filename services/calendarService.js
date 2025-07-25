const Event = require('../models/Event');
const { parseISO, isBefore, addMinutes, formatISO, differenceInMinutes } = require('date-fns');
const { isOverlapping, generateSlots } = require('../utils/timeUtils');

const BUFFER_MINUTES = 15;
const WORK_HOURS = { start: 9, end: 17 }; // 9 AM - 5 PM
const MAX_DURATION_MINUTES = 8 * 60; // 8 hours max

exports.checkConflicts = async (start, end, participants) => {
  const startTime = parseISO(start);
  const endTime = parseISO(end);
  const now = new Date();

  const duration = differenceInMinutes(endTime, startTime);

  if (isBefore(endTime, now)) {
    return {
      status: false,
      message: "The selected time range is already in the past.",
      conflict: null,
      conflictingEvents: []
    };
  }

  if (duration > MAX_DURATION_MINUTES) {
    return {
      status: false,
      message: "Invalid request: time range cannot span multiple working days.",
      conflict: null,
      conflictingEvents: []
    };
  }

  const events = await Event.find({
    participants: { $in: participants }
  });

  const conflicts = events.filter(event =>
    isOverlapping(startTime, endTime, event)
  );

  return {
    status: true,
    conflict: conflicts.length > 0,
    conflictingEvents: conflicts
  };
};

exports.suggestTimes = async (start, end, participants) => {
  const startTime = parseISO(start);
  const endTime = parseISO(end);
  const now = new Date();

  if (isBefore(endTime, now)) {
    return {
      status: false,
      message: "Requested time range is already in the past. Please select a future time."
    };
  }

  const duration = differenceInMinutes(endTime, startTime);
  const slotWindowStart = isBefore(startTime, now) ? now : startTime;

  const events = await Event.find({ participants: { $in: participants } });
  const slots = generateSlots(slotWindowStart, endTime, duration, WORK_HOURS);

  const available = slots.filter(slot => {
    return !events.some(event => isOverlapping(slot.start, slot.end, event));
  });

  if (available.length === 0) {
    return {
      status: false,
      message: "No available time slots found within the selected date range. Try adjusting your duration or selecting a broader range."
    };
  }

  return {
    status: true,
    availableSlots: available.slice(0, 3).map(slot => ({
      start: formatISO(slot.start),
      end: formatISO(slot.end)
    }))
  };
};



exports.createEvent = async (start, end, participants) => {
  const startTime = parseISO(start);
  const endTime = parseISO(end);
  const now = new Date(); // UTC

  if (isBefore(endTime, now)) {
    throw new Error("Cannot create event in the past.");
  }

  const conflicts = await this.checkConflicts(start, end, participants);
  if (conflicts.conflict) {
    throw new Error('Conflict detected with existing events. Cannot create.');
  }

  const newEvent = new Event({ start: startTime, end: endTime, participants });
  return {status: true, result: await newEvent.save()};
};