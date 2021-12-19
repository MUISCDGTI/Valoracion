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

    it.each([0, 0.1, 3, 4.9, 5])
        ("writes a rating in the DB with value between max and min", (value, done) => {
        const rating = new Rating(
            {
                value: value, 
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

    it.each([-100, -1, -0-1])
        ("not writes a rating in the DB with value less than minimun", (value, done) => {
        const rating = new Rating(
            {
                value: value, 
                description: "Good film", 
                film: "1",
                user: "11",
                date: "2020-12-02T23:00:00.000+00:00"
            }
        );

        rating.save((err, rating) => {
            err_message = "Rating validation failed: value: Path `value` (" + value.toString() + ") is less than minimum allowed value (0)."
            expect(err.message).toEqual(err_message);
            done();
        });
    });

    it.each([5.1, 6, 100])
        ("not writes a rating in the DB with value greater than maximum", (value, done) => {
        const rating = new Rating(
            {
                value: value, 
                description: "Good film", 
                film: "1",
                user: "11",
                date: "2020-12-02T23:00:00.000+00:00"
            }
        );

        rating.save((err, rating) => {
            err_message = "Rating validation failed: value: Path `value` (" + value.toString() + ") is more than maximum allowed value (5)."
            expect(err.message).toEqual(err_message);
            done();
        });
    });

    it("not writes a rating in the DB with null description", (done) => {
        const rating = new Rating(
            {
                value: "4.5", 
                description: "", 
                film: "1",
                user: "11",
                date: "2020-12-02T23:00:00.000+00:00"
            }
        );

        rating.save((err, rating) => {
            err_message = "Rating validation failed: description: Path `description` is required."
            expect(err.message).toEqual(err_message);
            done();
        });
    });

    it("not writes a rating in the DB with null film", (done) => {
        const rating = new Rating(
            {
                value: "4.5", 
                description: "Good film", 
                film: "",
                user: "11",
                date: "2020-12-02T23:00:00.000+00:00"
            }
        );

        rating.save((err, rating) => {
            err_message = "Rating validation failed: film: Path `film` is required."
            expect(err.message).toEqual(err_message);
            done();
        });
    });

    it("not writes a rating in the DB with null user", (done) => {
        const rating = new Rating(
            {
                value: "4.5", 
                description: "Good film", 
                film: "1",
                user: "",
                date: "2020-12-02T23:00:00.000+00:00"
            }
        );

        rating.save((err, rating) => {
            err_message = "Rating validation failed: user: Path `user` is required."
            expect(err.message).toEqual(err_message);
            done();
        });
    });

    it("not writes a rating in the DB with future date", (done) => {
        const rating = new Rating(
            {
                value: "4.5", 
                description: "Good film", 
                film: "1",
                user: "11",
                date: "2025-12-02T23:00:00.000+00:00"
            }
        );

        rating.save((err, rating) => {
            err_message = "Rating validation failed: date: The date must be in the past."
            expect(err.message).toEqual(err_message);
            done();
        });
    });

    it("not writes a rating in the DB with null date", (done) => {
        const rating = new Rating(
            {
                value: "4.5", 
                description: "Good film", 
                film: "1",
                user: "11",
                date: ""
            }
        );

        rating.save((err, rating) => {
            err_message = "Rating validation failed: date: Path `date` is required."
            expect(err.message).toEqual(err_message);
            done();
        });
    });

    afterAll((done) => {
        mongoose.connection.db.dropDatabase(() => {
            mongoose.connection.close(done);
        });
    });
});