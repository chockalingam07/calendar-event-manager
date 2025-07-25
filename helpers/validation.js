const { body } = require("express-validator");

exports.validateCalendarInput = [
  body("start").isISO8601().withMessage("Start must be a valid ISO 8601 date"),

  body("end").isISO8601().withMessage("End must be a valid ISO 8601 date"),

  body("participants")
    .isArray({ min: 1 })
    .withMessage("Participants must be a non-empty array")
    .custom((arr) => {
      const trimmed = arr.map((item) => item.trim());
      const unique = new Set(trimmed);
      if (unique.size !== trimmed.length) {
        throw new Error('Participants must be unique');
      }
      return true;
    }),

  body("participants.*")
    .isString()
    .withMessage("Each participant must be a string")
    .trim()
    .notEmpty()
    .withMessage("Each participant must be a non-empty string"),
];