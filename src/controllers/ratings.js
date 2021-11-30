const express = require("express");
const app = express.Router();

var Rating = require("../models/rating.js");

app.get("/", (req, res) => {
  console.log(Date() + " - GET /ratings");

  var queries = req.query;

  if (queries.description) {
    const regex = new RegExp(queries.description, "i");
    queries.description = { $regex: regex };
  }

  var dates = [];
  if (queries.between) {
    dates = queries.between.split(":");
    queries.date = {
      $gte: new Date(dates[0]),
      $lt: new Date(dates[1]),
    };
  }

  queries.lessThan ? (queries.value = { $lte: queries.lessThan }) : null;
  queries.greaterThan ? (queries.value = { $gt: queries.greaterThan }) : null;

  Rating.find(
    queries,
    null,
    { sort: { date: queries.sort === "des" ? -1 : 1 } },
    (err, ratings) => {
      if (err) {
        console.log(Date() + " - " + err);
        res.sendStatus(500);
      } else {
        res.send(
          ratings.map((rating) => {
            return rating.cleanup();
          })
        );
      }
    }
  );
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

app.delete("/:rating_id", (req, res) => {
  console.log(Date() + " - DELETE /ratings/:rating_id");
  const rating_id = req.params.rating_id;
  Rating.deleteOne({ _id: rating_id }, (err, rating) => {
    if (err) {
      console.log(Date() + " - " + err);
      res.sendStatus(500);
    } else {
      res.sendStatus(200);
    }
  });
});

module.exports = app;
