const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
  value: {
    type: Number,
    required: true,
    min: 0,
    max: 5
  },
  description: {
    type: String,
    required: true
  },
  film: {
    type: String,
    required: true
  },
  user: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
    validate: {
      validator: function (v) {
        return (
          v && // check that there is a date object
          v < Date.now()
        );
      },
      message:
        "The date must be in the past.",
    }
  },
});

const Rating = mongoose.model("Rating", ratingSchema);

module.exports = Rating;
