const { addMinutes, setHours, setMinutes, isBefore } = require('date-fns');

// check the overlapping
exports.isOverlapping = (start, end, event) => {
  const bufferStart = addMinutes(start, -15);
  const bufferEnd = addMinutes(end, 15);
  const eventStart = new Date(event.start);
  const eventEnd = new Date(event.end);

  return bufferStart < eventEnd && bufferEnd > eventStart;
};

// generateSlots upcoming
exports.generateSlots = (start, end, duration, workingHours) => {
  const slots = [];
  let current = new Date(start);

  while (isBefore(current, end)) {
    const dayStart = setHours(setMinutes(new Date(current), 0), workingHours.start);
    const dayEnd = setHours(setMinutes(new Date(current), 0), workingHours.end);

    let slotStart = isBefore(current, dayStart) ? dayStart : current;

    while (isBefore(addMinutes(slotStart, duration), dayEnd)) {
      slots.push({
        start: new Date(slotStart),
        end: addMinutes(new Date(slotStart), duration)
      });
      slotStart = addMinutes(slotStart, 15);
    }

    current.setUTCDate(current.getUTCDate() + 1);
    current = setHours(setMinutes(current, 0), workingHours.start);
  }

  return slots;
};