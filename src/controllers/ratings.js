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

app.get("/:rating_id", (req, res) => {
  console.log(Date() + " - GET /ratings BY ID");
  let id = req.params.rating_id;

  Rating.findById({ _id:id }, (err, rating) => {
    if (err) {
      console.log(Date() + " - " + err);
      res.sendStatus(500);
    } else {
      res.send(rating.cleanup());
    }
  });
});

app.put("/:rating_id/value", (req, res) => {
  console.log(Date() + " - GET /ratings PUT VALUE");
  let id = req.params.rating_id;
  let value = req.body.value;

  const filter = { _id: id };
  const update = { value: value };
  Rating.findOneAndUpdate(filter, update, (err, rating) => {
    if (err) {
      console.log(Date() + " - " + err);
      res.sendStatus(500);
    } else {
      rating.value = value;
      res.send(rating.cleanup());
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