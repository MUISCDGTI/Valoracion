const app = require("../server.js");
const request = require("supertest");
const Rating = require("../src/models/rating.js");
const ApiKey = require("../apikeys.js");

describe("Ratings API", () => {
  const user = {
    user : "test",
    apikey: "1"
  };

  auth = jest.spyOn(ApiKey, "findOne");
  auth.mockImplementation((query, callback) => {
    callback(null, new ApiKey(user));
  });

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
    beforeEach(() => {
      const ratings = [
        {
          value: "4.5",
          description: "Good film",
          film: "1",
          user: "11",
          date: "2020-11-02T23:00:00.000+00:00",
        },
        {
          value: "1.5",
          description: "Bad film",
          film: "15",
          user: "19",
          date: "2021-12-02T23:00:00.000+00:00",
        },
        {
          value: "3",
          description: "Nice",
          film: "15",
          user: "11",
          date: "2021-12-16T17:00:00.000+00:00",
        },
      ];

      const user = {
        user : "test",
        apikey: "1"
      };

      dbFind = jest.spyOn(Rating, "find");
      dbFind.mockImplementation((query, sm, sort, callback) => {
        callback(null, ratings);
      });

      auth = jest.spyOn(ApiKey, "findOne");
      auth.mockImplementation((query, callback) => {
        callback(null, new ApiKey(user));
      });
    });

    it("should return all ratings sortered asc", () => {
      return request(app)
        .get("/api/v1/ratings")
        .set("apikey", "1")
        .then((response) => {
          expect(response.statusCode).toBe(200);
          expect(response.body).toStrictEqual([
            {
              value: "4.5",
              description: "Good film",
              film: "1",
              user: "11",
              date: "2020-11-02T23:00:00.000+00:00",
            },
            {
              value: "1.5",
              description: "Bad film",
              film: "15",
              user: "19",
              date: "2021-12-02T23:00:00.000+00:00",
            },
            {
              value: "3",
              description: "Nice",
              film: "15",
              user: "11",
              date: "2021-12-16T17:00:00.000+00:00",
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

    it("should return all ratings sortered des", () => {
      dbFind.mockImplementation((query, sm, sort, callback) => {
        callback(null, [{
          value: "3",
          description: "Nice",
          film: "15",
          user: "11",
          date: "2021-12-16T17:00:00.000+00:00",
        },
        {
          value: "1.5",
          description: "Bad film",
          film: "15",
          user: "19",
          date: "2021-12-02T23:00:00.000+00:00",
        },
        {
          value: "4.5",
          description: "Good film",
          film: "1",
          user: "11",
          date: "2020-11-02T23:00:00.000+00:00",
        },]);
      });
      return request(app)
        .get("/api/v1/ratings")
        .set("apikey", "1")
        .query({ sort: "des" })
        .then((response) => {
          expect(response.statusCode).toBe(200);
          expect(response.body).toStrictEqual([
            {
              value: "3",
              description: "Nice",
              film: "15",
              user: "11",
              date: "2021-12-16T17:00:00.000+00:00",
            },
            {
              value: "1.5",
              description: "Bad film",
              film: "15",
              user: "19",
              date: "2021-12-02T23:00:00.000+00:00",
            },
            {
              value: "4.5",
              description: "Good film",
              film: "1",
              user: "11",
              date: "2020-11-02T23:00:00.000+00:00",
            },
          ]);
          expect(dbFind).toBeCalledWith(
            { sort: "des" },
            null,
            { sort: { date: -1 } },
            expect.any(Function)
          );
        });
    });

    it("should return ratings filtered by description", () => {
      dbFind.mockImplementation((query, sm, sort, callback) => {
        callback(null, [{
          value: "4.5",
          description: "Good film",
          film: "1",
          user: "11",
          date: "2020-11-02T23:00:00.000+00:00",
        },
        {
          value: "1.5",
          description: "Bad film",
          film: "15",
          user: "19",
          date: "2021-12-02T23:00:00.000+00:00",
        }]);
      });
      return request(app)
        .get("/api/v1/ratings")
        .set("apikey", "1")
        .query({ description: "film" })
        .then(
          (response) => {
            expect(response.statusCode).toBe(200);
            expect(response.body).toStrictEqual([
              {
                value: "4.5",
                description: "Good film",
                film: "1",
                user: "11",
                date: "2020-11-02T23:00:00.000+00:00",
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
              { description: { $regex: /film/i } },
              null,
              { sort: { date: 1 } },
              expect.any(Function)
            );
          }
        );
    });

    it("should return ratings filtered by range of dates", () => {
      dbFind.mockImplementation((query, sm, sort, callback) => {
        callback(null, [{
          value: "1.5",
          description: "Bad film",
          film: "15",
          user: "19",
          date: "2021-12-02T23:00:00.000+00:00",
        },
        {
          value: "3",
          description: "Nice",
          film: "15",
          user: "11",
          date: "2021-12-16T17:00:00.000+00:00",
        }]);
      });
      return request(app)
        .get("/api/v1/ratings")
        .set("apikey", "1")
        .query({ between: "2020-12-01:2021-12-20" })
        .then(
          (response) => {
            expect(response.statusCode).toBe(200);
            expect(response.body).toStrictEqual([
              {
                value: "1.5",
                description: "Bad film",
                film: "15",
                user: "19",
                date: "2021-12-02T23:00:00.000+00:00",
              },
              {
                value: "3",
                description: "Nice",
                film: "15",
                user: "11",
                date: "2021-12-16T17:00:00.000+00:00",
              }
            ]);
          }
        );
    });

    it("should return ratings filtered by user", () => {
      dbFind.mockImplementation((query, sm, sort, callback) => {
        callback(null, [{
          value: "4.5",
          description: "Good film",
          film: "1",
          user: "11",
          date: "2020-11-02T23:00:00.000+00:00",
        },
        {
          value: "3",
          description: "Nice",
          film: "15",
          user: "11",
          date: "2021-12-16T17:00:00.000+00:00",
        }]);
      });
      return request(app)
        .get("/api/v1/ratings")
        .set("apikey", "1")
        .query({ user: 11 })
        .then(
          (response) => {
            expect(response.statusCode).toBe(200);
            expect(response.body).toStrictEqual([
              {
                value: "4.5",
                description: "Good film",
                film: "1",
                user: "11",
                date: "2020-11-02T23:00:00.000+00:00",
              },
              {
                value: "3",
                description: "Nice",
                film: "15",
                user: "11",
                date: "2021-12-16T17:00:00.000+00:00",
              }
            ]);
            expect(dbFind).toBeCalledWith(
              { user: "11" },
              null,
              { sort: { date: 1 } },
              expect.any(Function)
            );
          }
        );
    });

    it("should return ratings filtered by film", () => {
      dbFind.mockImplementation((query, sm, sort, callback) => {
        callback(null, [{
          value: "1.5",
          description: "Bad film",
          film: "15",
          user: "19",
          date: "2021-12-02T23:00:00.000+00:00",
        },
        {
          value: "3",
          description: "Nice",
          film: "15",
          user: "11",
          date: "2021-12-16T17:00:00.000+00:00",
        }]);
      });
      return request(app)
        .get("/api/v1/ratings")
        .set("apikey", "1")
        .query({film: 15})
        .then(
          (response) => {
            expect(response.statusCode).toBe(200);
            expect(response.body).toStrictEqual([
              {
                value: "1.5",
                description: "Bad film",
                film: "15",
                user: "19",
                date: "2021-12-02T23:00:00.000+00:00",
              },
              {
                value: "3",
                description: "Nice",
                film: "15",
                user: "11",
                date: "2021-12-16T17:00:00.000+00:00",
              }
            ]);
            expect(dbFind).toBeCalledWith(
              { film: "15"},
              null,
              { sort: { date: 1 } },
              expect.any(Function)
            );
          }
        );
    });
  });

  describe("GET /ratings BY ID", () => {
    beforeAll(() => {
      const rating = 
        {
          _id: "619e98f2ac8738570c90a206",
          value: "4.5",
          description: "Good film",
          film: "1",
          user: "11",
          date: "2020-12-02T23:00:00.000+00:00",
        };

      const user = {
        user : "test",
        apikey: "1"
      };

      dbFindById = jest.spyOn(Rating, "findById");
      dbFindById.mockImplementation((r, callback) => {
        callback(null, rating);
      });

      auth = jest.spyOn(ApiKey, "findOne");
      auth.mockImplementation((query, callback) => {
        callback(null, new ApiKey(user));
      });
    });

    it("should return a rating by id", () => {
      return request(app)
        .get("/api/v1/ratings/619e98f2ac8738570c90a206")
        .set("apikey", "1")
        .then((response) => {
          expect(response.statusCode).toBe(200);
          expect(response.body).toStrictEqual({
            _id: "619e98f2ac8738570c90a206",
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

    it("should not return any rating due to incorrect id", () => {
      dbFindById.mockImplementation((r, callback) => {
        callback(`CastError: Cast to ObjectId failed for value "{ _id: "661bf5c67b5a9c726fa8f4a7d" }" (type Object) at path "_id" for model "Rating"`, null);
      });

      return request(app)
        .get("/api/v1/ratings/619e98f2ac8738570c90a205")
        .set("apikey", "1")
        .then((response) => {
          expect(response.statusCode).toBe(500);
          expect(response.body).toStrictEqual({});
          expect(dbFindById).toBeCalledWith(
            { _id: "619e98f2ac8738570c90a205" },
            expect.any(Function)
          );
        });
    });
  });

  describe("PUT /ratings DESCRIPTION", () => {
    beforeAll(() => {
      const rating = {
        value: "4.5",
        description: "Good film",
        film: "1",
        user: "11",
        date: "2020-12-02T23:00:00.000+00:00",
      };
      
      const user = {
        user : "test",
        apikey: "1"
      };

      dbFindOneAndUpdate = jest.spyOn(Rating, "findOneAndUpdate");
      dbFindOneAndUpdate.mockImplementation((r, description, validator, callback) => {
        callback(null, rating);
      });

      auth = jest.spyOn(ApiKey, "findOne");
      auth.mockImplementation((query, callback) => {
        callback(null, new ApiKey(user));
      });
    });

    const description = { description: "New description" };

    it("should update a rating description by id", () => {
      return request(app)
        .put("/api/v1/ratings/619e98f2ac8738570c90a206/description")
        .set("apikey", "1")
        .send(description)
        .then((response) => {
          expect(response.statusCode).toBe(200);
          expect(dbFindOneAndUpdate).toBeCalledWith(
            { _id: "619e98f2ac8738570c90a206" },
            { description: "New description" },
            { runValidators: true },
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

    it("should not update a rating description by id due to description type", () => {
      dbFindOneAndUpdate.mockImplementation((r, callback) => {
        callback(`TypeError: The "string" argument must be of type string or an instance of Buffer or ArrayBuffer. Received type number (1)`, null);
      });
      return request(app)
        .put("/api/v1/ratings/619e98f2ac8738570c90a206/description")
        .set("apikey", "1")
        .send({description: 1})
        .then((response) => {
          expect(response.statusCode).toBe(500);
          expect(dbFindOneAndUpdate).toBeCalledWith(
            { _id: "619e98f2ac8738570c90a206" },
            { description: 1 },
            { runValidators: true },
            expect.any(Function)
          );
        });
    });

    it("should not update a rating description by id due to ratings does not exist", () => {
      dbFindOneAndUpdate.mockImplementation((r, callback) => {
        callback(true);
      });
      return request(app)
        .put("/api/v1/ratings/update/description")
        .set("apikey", "1")
        .send(description)
        .then((response) => {
          expect(response.statusCode).toBe(500);
          expect(dbFindOneAndUpdate).toBeCalledWith(
            { _id: "update" },
            description,
            { runValidators: true },
            expect.any(Function)
          );
        });
    });
  });

  describe("PUT /ratings VALUE", () => {
    beforeAll(() => {
      const rating = {
        value: "4.5",
        description: "Good film",
        film: "1",
        user: "11",
        date: "2020-12-02T23:00:00.000+00:00",
      };

      const user = {
        user : "test",
        apikey: "1"
      };

      dbFindOneAndUpdate = jest.spyOn(Rating, "findOneAndUpdate");
      dbFindOneAndUpdate.mockImplementation((r, value, validator, callback) => {
        callback(null, rating);
      });

      auth = jest.spyOn(ApiKey, "findOne");
      auth.mockImplementation((query, callback) => {
        callback(null, new ApiKey(user));
      });
    });

    const value = { value: "3" };

    it("should update a rating value by id", () => {
      return request(app)
        .put("/api/v1/ratings/619e98f2ac8738570c90a206/value")
        .set("apikey", "1")
        .send(value)
        .then((response) => {
          expect(response.statusCode).toBe(200);
          expect(dbFindOneAndUpdate).toBeCalledWith(
            { _id: "619e98f2ac8738570c90a206" },
            { value: "3" },
            { runValidators: true },
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

    it("should not update a rating value by id due to value type", () => {
      dbFindOneAndUpdate.mockImplementation((r, callback) => {
        callback(` CastError: Cast to Number failed for value "value" (type string) at path "value"`, null);
      });
      return request(app)
        .put("/api/v1/ratings/619e98f2ac8738570c90a206/value")
        .set("apikey", "1")
        .send({ value: "value" })
        .then((response) => {
          expect(response.statusCode).toBe(500);
          expect(dbFindOneAndUpdate).toBeCalledWith(
            { _id: "619e98f2ac8738570c90a206" },
            { value: "value" },
            { runValidators: true },
            expect.any(Function)
          );
          console.log(response)
        });
    });

    it("should not update a rating value by id due to ratings does not exist", () => {
      dbFindOneAndUpdate.mockImplementation((r, callback) => {
        callback(true);
      });
      return request(app)
        .put("/api/v1/ratings/update/value")
        .set("apikey", "1")
        .send(value)
        .then((response) => {
          expect(response.statusCode).toBe(500);
          expect(dbFindOneAndUpdate).toBeCalledWith(
            { _id: "update" },
            value,
            { runValidators: true },
            expect.any(Function)
          );
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
      const user = {
        user : "test",
        apikey: "1"
      };

      dbInsert = jest.spyOn(Rating, "create");

      auth = jest.spyOn(ApiKey, "findOne");
      auth.mockImplementation((query, callback) => {
        callback(null, new ApiKey(user));
      });
    });

    it("should add a new rating", () => {
      dbInsert.mockImplementation((r, callback) => {
        callback(false);
      });

      return request(app)
        .post("/api/v1/ratings")
        .set("apikey", "1")
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
        .set("apikey", "1")
        .send(rating)
        .then((response) => {
          expect(response.statusCode).toBe(500);
        });
    });
  });

  describe("DELETE /ratings/:rating_id", () => {
    beforeAll(() => {
      const rating = {
        value: "4.5",
        description: "Good film",
        film: "1",
        user: "11",
        date: "2020-12-02T23:00:00.000+00:00",
      };

      const user = {
        user : "test",
        apikey: "1"
      };

      dbDelete = jest.spyOn(Rating, "deleteOne");

      auth = jest.spyOn(ApiKey, "findOne");
      auth.mockImplementation((query, callback) => {
        callback(null, new ApiKey(user));
      });
    });

    it("should delete a rating", () => {
      dbDelete.mockImplementation((r, callback) => {
        callback(false);
      });
      return request(app)
        .delete("/api/v1/ratings/619e98f2ac8738570c90a206")
        .set("apikey", "1")
        .then((response) => {
          expect(response.statusCode).toBe(200);
          expect(dbDelete).toBeCalledWith(
            { _id: "619e98f2ac8738570c90a206" },
            expect.any(Function)
          );
        });
    });

    it("should not delete a rating due to does not exist rating", () => {
      dbDelete.mockImplementation((r, callback) => {
        callback(true);
      });
      return request(app)
        .delete("/api/v1/ratings/delete")
        .set("apikey", "1")
        .then((response) => {
          expect(response.statusCode).toBe(500);
          expect(dbDelete).toBeCalledWith(
            { _id: "delete" },
            expect.any(Function)
          );
        });
    });
  });
});
