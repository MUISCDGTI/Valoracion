const Rating = require("../src/models/rating.js");
const mongoose = require("mongoose");
const dbConnect = require("../db.js");

describe("Ratings DB connection", () => {
    beforeAll(() => {
        return dbConnect();
    });

    beforeEach((done) => {
        Rating.deleteMany({}, (err) => {
            done();
        });
    });

    it("writes a rating in the DB", (done) => {
        const rating = new Rating(
            {
                value: "4.5", 
                description: "Good film", 
                film: "1",
                user: "11",
                date: "2020-12-02T23:00:00.000+00:00"
            }
        );

        rating.save((err, rating) => {
            expect(err).toBeNull();
            Rating.find({}, (err, ratings) => {
                expect(ratings).toBeArrayOfSize(1);
                done();
            });
        });
    });

    afterAll((done) => {
        mongoose.connection.db.dropDatabase(() => {
            mongoose.connection.close(done);
        });
    });
});