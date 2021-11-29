const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
  value: Number,
  description: String,
  film: String,
  user: String,
  date: Date,
});

ratingSchema.methods.cleanup = function () {
  return {
    value: this.value,
    description: this.description,
    film: this.film,
    user: this.user,
    date: this.date,
  };
};

const Rating = mongoose.model("Rating", ratingSchema);

module.exports = Rating;
