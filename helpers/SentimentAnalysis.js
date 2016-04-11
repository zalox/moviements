var sentiment = require('sentiment');

module.exports = function (review) {
  var r = sentiment(review.review);
  review.score = r.score;
  review.save(function (err) {
    if (err) {
      console.error('A review sentiment analysis was not stored.');
    }
  });
};