const app = require("../server.js");
const controller = require("../src/controllers/ratings.js");
const request = require("supertest");
const Rating = require("../src/models/rating.js");

describe("Ratings API", () => {
  describe("GET /", () => {
    it("should return an HTML document", () => {
      return request(app)
        .get("/")
        .then((response) => {
          expect(response.status).toBe(200);
          expect(response.type).toEqual(expect.stringContaining("html"));
          expect(response.text).toEqual(expect.stringContaining("h1"));
        });
    });
  });

  describe("GET /ratings", () => {
    beforeAll(() => {
      const ratings = [
        {
          value: "4.5",
          description: "Good film",
          film: "1",
          user: "11",
          date: "2020-12-02T23:00:00.000+00:00",
        },
        {
          value: "1.5",
          description: "Bad film",
          film: "15",
          user: "19",
          date: "2021-12-02T23:00:00.000+00:00",
        },
      ];

      dbFind = jest.spyOn(Rating, "find");
      dbFind.mockImplementation((query, sm, sort, callback) => {
        callback(null, ratings);
      });
    });

    it("should return all ratings", () => {
      return request(app)
        .get("/api/v1/ratings")
        .then((response) => {
          expect(response.statusCode).toBe(200);
          expect(response.body).toStrictEqual([
            {
              value: "4.5",
              description: "Good film",
              film: "1",
              user: "11",
              date: "2020-12-02T23:00:00.000+00:00",
            },
            {
              value: "1.5",
              description: "Bad film",
              film: "15",
              user: "19",
              date: "2021-12-02T23:00:00.000+00:00",
            },
          ]);
          expect(dbFind).toBeCalledWith(
            {},
            null,
            { sort: { date: 1 } },
            expect.any(Function)
          );
        });
    });
  });

  describe("GET /ratings BY ID", () => {
    beforeAll(() => {
      const rating = 
        {
          value: "4.5",
          description: "Good film",
          film: "1",
          user: "11",
          date: "2020-12-02T23:00:00.000+00:00",
        };

      dbFindById = jest.spyOn(Rating, "findById");
      dbFindById.mockImplementation((r, callback) => {
        callback(null, rating);
      });
    });

    it("should return a rating by id", () => {
      return request(app)
        .get("/api/v1/ratings/619e98f2ac8738570c90a206")
        .then((response) => {
          expect(response.statusCode).toBe(200);
          expect(response.body).toStrictEqual({
            value: "4.5",
            description: "Good film",
            film: "1",
            user: "11",
            date: "2020-12-02T23:00:00.000+00:00",
          });
          expect(dbFindById).toBeCalledWith(
            { _id: "619e98f2ac8738570c90a206" },
            expect.any(Function)
          );
        });
    });
  });

  describe("PUT /ratings DESCRIPTION", () => {
    beforeAll(() => {
      const rating = 
        {
          value: "4.5",
          description: "Good film",
          film: "1",
          user: "11",
          date: "2020-12-02T23:00:00.000+00:00",
        };

      dbFindOneAndUpdate = jest.spyOn(Rating, "findOneAndUpdate");
      dbFindOneAndUpdate.mockImplementation((r, description, callback) => {
        callback(null, rating);
      });
    });

    const description = { description: "New description" };

    it("should update a rating description by id", () => {
      return request(app)
        .put("/api/v1/ratings/619e98f2ac8738570c90a206/description")
        .send(description)
        .then((response) => {
          expect(response.statusCode).toBe(200);
          expect(dbFindOneAndUpdate).toBeCalledWith(
            { _id: "619e98f2ac8738570c90a206" },
            { description: "New description" },
            expect.any(Function)
          );
          expect(response.body).toStrictEqual({
              value: "4.5",
              description: "New description",
              film: "1",
              user: "11",
              date: "2020-12-02T23:00:00.000+00:00",
            });
        });
    });
  });

  describe("PUT /ratings VALUE", () => {
    beforeAll(() => {
      const rating = 
        {
          value: "4.5",
          description: "Good film",
          film: "1",
          user: "11",
          date: "2020-12-02T23:00:00.000+00:00",
        };

      dbFindOneAndUpdate = jest.spyOn(Rating, "findOneAndUpdate");
      dbFindOneAndUpdate.mockImplementation((r, value, callback) => {
        callback(null, rating);
      });
    });

    const value = { value: "3" };

    it("should update a rating value by id", () => {
      return request(app)
        .put("/api/v1/ratings/619e98f2ac8738570c90a206/value")
        .send(value)
        .then((response) => {
          expect(response.statusCode).toBe(200);
          expect(dbFindOneAndUpdate).toBeCalledWith(
            { _id: "619e98f2ac8738570c90a206" },
            { value: "3" },
            expect.any(Function)
          );
          expect(response.body).toStrictEqual({
              value: "3",
              description: "Good film",
              film: "1",
              user: "11",
              date: "2020-12-02T23:00:00.000+00:00",
            });
        });
    });
  });

  describe("POST /ratings", () => {
    const rating = {
      value: 4.5,
      description: "Good film",
      film: 1,
      user: 11,
      date: "2020-12-02T23:00:00.000+00:00",
    };

    let dbInsert;

    beforeEach(() => {
      dbInsert = jest.spyOn(Rating, "create");
    });

    it("should add a new rating", () => {
      dbInsert.mockImplementation((r, callback) => {
        callback(false);
      });

      return request(app)
        .post("/api/v1/ratings")
        .send(rating)
        .then((response) => {
          expect(response.statusCode).toBe(201);
          expect(dbInsert).toBeCalledWith(rating, expect.any(Function));
        });
    });

    it("should return 500 if there is a problem with the DB", () => {
      dbInsert.mockImplementation((r, callback) => {
        callback(true);
      });

      return request(app)
        .post("/api/v1/ratings")
        .send(rating)
        .then((response) => {
          expect(response.statusCode).toBe(500);
        });
    });
  });

  describe("DELETE /ratings/:rating_id", () => {
    beforeAll(() => {
      const rating = 
        {
          value: "4.5",
          description: "Good film",
          film: "1",
          user: "11",
          date: "2020-12-02T23:00:00.000+00:00",
        };

      dbDelete = jest.spyOn(Rating, "deleteOne");
    });

    it("should delete a rating", () => {
      dbDelete.mockImplementation((r, callback) => {
        callback(false);
      });
      return request(app)
        .delete("/api/v1/ratings/619e98f2ac8738570c90a206")
        .then((response) => {
          expect(response.statusCode).toBe(200);
          expect(dbDelete).toBeCalledWith(
            { _id: "619e98f2ac8738570c90a206" },
            expect.any(Function)
          );
        });
    });
  });
});
