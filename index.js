const app = require("./server.js");
const dbConnect = require("./db.js");
const RatingsResource = require('./ratingsResource');

var port = (process.env.PORT || 5000);

console.log("Starting API server at " + port);

app.get("/", (req, res) => {
  console.log(Date() + " - GET /ratings");

  RatingsResource.getAllRatings().then((body) => {
    response.send(body);
  }).catch((err)=> {
    console.log("error: " + error);
    response.sendStatus(500);
  });
});

dbConnect().then(
  () => {
    app.listen(port);
    console.log("Server ready!");
  },
  (err) => {
    console.log("Connection error: " + err);
  }
);

module.exports = RatingsResource;