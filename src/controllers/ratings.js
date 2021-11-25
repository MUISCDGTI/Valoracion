const express = require("express");
const app = express.Router();

var Rating = require('../models/rating.js')

app.get("/", (req, res) => {
  console.log(Date() + " - GET /ratings");

  Rating.find({}, (err, ratings) => {
    if (err) {
      console.log(Date() + " - " + err);
      res.sendStatus(500);
    } else {
      res.send(ratings.map((rating) => {
        return rating.cleanup();
      }));
    }
  });
});

app.post("/", (req, res) => {
  console.log(Date() + " - POST /ratings");

  var rating = req.body;
  Rating.create(rating, (err) => {
    if (err) {
      console.log(Date() + " - " + err);
      res.sendStatus(500);
    } else {
      res.sendStatus(201);
    }
  });
});

module.exports = app;
