const express = require("express");
const app = express.Router();
var Rating = require("../models/rating.js");
const { response } = require("../../server");

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

  if (queries.lessThan || queries.greaterThan) {
    queries.value = { $lte: queries.lessThan, $gt: queries.greaterThan };
  }

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
            return rating;
          })
        );
      }
    }
  );
});

app.get("/:rating_id", (req, res) => {
  console.log(Date() + " - GET /ratings BY ID");
  let id = req.params.rating_id;

  Rating.findById({ _id: id }, (err, rating) => {
    if (err) {
      console.log(Date() + " - " + err);
      res.sendStatus(500);
    } else {
      res.send(rating);
    }
  });
});

app.put("/:rating_id/value", (req, res) => {
  console.log(Date() + " - PUT /ratings VALUE");
  let id = req.params.rating_id;
  let value = req.body.value;

  const filter = { _id: id };
  const update = { value: value };
  Rating.findOneAndUpdate(
    filter,
    update,
    { runValidators: true },
    (err, rating) => {
      if (err) {
        console.log(Date() + " - " + err);

        if (err.errors) {
          res.status(400).send({ error: err.message });
        } else {
          res.sendStatus(500);
        }
      } else {
        rating.value = value;
        res.send(rating);
      }
    }
  );
});

app.put("/:rating_id/description", (req, res) => {
  console.log(Date() + " - PUT /ratings DESCRIPTION");
  let id = req.params.rating_id;
  let description = req.body.description;

  const filter = { _id: id };
  const update = { description: description };
  Rating.findOneAndUpdate(
    filter,
    update,
    { runValidators: true },
    (err, rating) => {
      if (err) {
        console.log(Date() + " - " + err);

        if (err.errors) {
          res.status(400).send({ error: err.message });
        } else {
          res.sendStatus(500);
        }
      } else {
        rating.description = description;
        res.send(rating);
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

      if (err.errors) {
        res.status(400).send({ error: err.message });
      } else {
        res.sendStatus(500);
      }
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
