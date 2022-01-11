const urlJoin = require('url-join');
const request = require('request-promise-native').defaults({json: true});

class RatingsResource {
  static ratingsUrl(url) {
    const ratingsServer = (process.env.RATINGS_URL || 'http://localhost:3000/api/v1');
    return urlJoin(ratingsServer, url);
  }

  static requestHeaders() {
    const ratingsKey = (provess.env.RATINGS_APIKEY || '25017cf0-4cca-4766-949c-e5aedba8e09b');
    return { apiKey: ratingsKey };
  }

  static getAllRatings() {
    const url = RatingsResource.ratingsUrl('/ratings');
    const options = { headers: RatingsResource.requestHeaders() };
    return request.get(url, options);
  }
}