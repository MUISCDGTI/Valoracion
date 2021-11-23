var express = require("express");
var bodyParser = require("body-parser");
var DataStore = require("nedb");

var port = 3000;
var BASE_API_PATH = "/api/v1";
var DB_FILE_NAME = __dirname + "/ratings.json";

console.log("Starting API server...");

var app = express();
app.use(bodyParser.json());

var db = new DataStore({
  filename: DB_FILE_NAME,
  autoload: true
});

app.get("/", (req, res) => {
  res.send("<html><body><h1>My server</h1></body></html>");
});

app.get(BASE_API_PATH + "/ratings", (req, res) => {
  console.log(Date() + " - GET /ratings");
  db.find({}, (err, ratings) => {
    if (err) {
      console.log(Date() + " - " + err);
      res.sendStatus(500);
    } else {
      res.send(ratings.map((rating) => {
        delete rating._id;
        return rating;
      }));
    }
  });
});

app.post(BASE_API_PATH + "/ratings", (req, res) => {
  console.log(Date() + " - POST /ratings");
  var rating = req.body;
  db.insert(rating, (err) => {
    if (err) {
      console.log(Date() + " - " + err);
      res.sendStatus(500);
    } else {
      res.sendStatus(201);
    }
  });
});

app.listen(port);

console.log("Server ready");
